from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict

import numpy as np
import pandas as pd
import shap
from xgboost import XGBRegressor
from .services.supabase_client import get_supabase

app = FastAPI(title="PRISM API", version="1.0.0")

# CORS for local dev web app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Simple model + SHAP setup (demo-grade) ----
FEATURE_KEYS = [
    "labour_cost",
    "material_cost",
    "regulatory_delay",
    "vendor_reliability",
    "weather_impact",
]

rng = np.random.default_rng(42)

def _train_demo_model():
    n = 600
    X = pd.DataFrame({
        "labour_cost": rng.uniform(0, 1, n),
        "material_cost": rng.uniform(0, 1, n),
        "regulatory_delay": rng.uniform(0, 1, n),
        "vendor_reliability": rng.uniform(0, 1, n),
        "weather_impact": rng.uniform(0, 1, n),
    })
    # Synthetic target ~ risk probability in [0,1]
    y = (
        0.35*X["regulatory_delay"]
        + 0.30*X["material_cost"]
        + 0.20*X["weather_impact"]
        + 0.10*X["labour_cost"]
        - 0.25*X["vendor_reliability"]
    ) + rng.normal(0, 0.03, n)
    y = y.clip(0, 1)
    model = XGBRegressor(
        n_estimators=120,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.9,
        colsample_bytree=0.9,
        reg_lambda=1.0,
        tree_method="hist",
        random_state=42,
    )
    model.fit(X, y)
    explainer = shap.TreeExplainer(model)
    background = shap.utils.sample(X, 100, random_state=42)
    return model, explainer, background

MODEL, EXPLAINER, BG = _train_demo_model()

class PredictRequest(BaseModel):
    project_id: Optional[str] = None
    features: Dict[str, float]

class PredictResponse(BaseModel):
    delay_months: float
    overrun_cr: float
    risk_prob: float
    shap_values: Optional[dict] = None
    explanation: Optional[str] = None

class ProjectIn(BaseModel):
    user_id: Optional[str] = None
    code: str
    name: str
    location_lat: float | None = None
    location_lng: float | None = None
    budget_cr: float | None = None
    status: Optional[str] = None
    risk: Optional[str] = None
    delay_months: Optional[float] = None

class ProjectOut(ProjectIn):
    id: Optional[int] = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    # Make the API root clear by redirecting to interactive docs
    return RedirectResponse(url="/docs", status_code=302)

def _vectorize(features: Dict[str, float]) -> pd.DataFrame:
    data = {k: float(features.get(k, 0.0)) for k in FEATURE_KEYS}
    return pd.DataFrame([data])

def _explain(x_df: pd.DataFrame) -> Dict[str, float]:
    shap_vals = EXPLAINER.shap_values(x_df, check_additivity=False)
    vals = shap_vals[0] if isinstance(shap_vals, np.ndarray) else shap_vals.values[0]
    return {k: float(v) for k, v in zip(FEATURE_KEYS, vals)}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    x = _vectorize(req.features)
    risk = float(np.clip(MODEL.predict(x)[0], 0.01, 0.99))
    delay = round(2 + 10 * risk, 2)
    overrun = round(5 + 40 * risk, 2)
    shap_map = _explain(x)
    # simple NL explanation: top 2 drivers by absolute SHAP
    top = sorted(shap_map.items(), key=lambda kv: abs(kv[1]), reverse=True)[:2]
    explanation = f"Top drivers: {top[0][0]} ({top[0][1]:.2f}), {top[1][0]} ({top[1][1]:.2f})."
    return PredictResponse(delay_months=delay, overrun_cr=overrun, risk_prob=risk, shap_values=shap_map, explanation=explanation)

@app.post("/what-if", response_model=PredictResponse)
def what_if(req: PredictRequest):
    return predict(req)

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    # Stubbed document extraction endpoint
    return {
        "project_name": {"value": "East Zone Power Line", "confidence": 0.98},
        "budget_cr": {"value": 18, "confidence": 0.70},
    }

@app.get("/projects")
def projects(user_id: Optional[str] = None):
    """Return projects from Supabase if configured; otherwise an empty list."""
    try:
        supa = get_supabase()
        q = supa.table('projects').select('*')
        if user_id:
            q = q.eq('user_id', user_id)
        res = q.order('id').execute()
        data = res.data or []
        # normalize shape for the frontend table
        out = []
        for r in data:
            out.append({
                "id": r.get('id'),
                "code": r.get('code'),
                "name": r.get('name'),
                "location": [r.get('location_lat'), r.get('location_lng')],
                "budget_cr": r.get('budget_cr'),
                "status": r.get('status'),
                "risk": r.get('risk'),
                "delay_months": r.get('delay_months'),
            })
        return out
    except Exception as e:
        # If not configured or table missing, return sensible default
        return []

@app.post("/projects", response_model=ProjectOut)
def create_project(p: ProjectIn):
    try:
        supa = get_supabase()
        payload = p.dict()
        res = supa.table('projects').insert(payload).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Insert failed")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")
