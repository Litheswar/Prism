"""PRISM API main module"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict

import numpy as np
import pandas as pd
import shap
from xgboost import XGBRegressor
from .services.supabase_client import get_supabase
from .security.jwt import issue_token, verify_token

app = FastAPI(title="PRISM API", version="1.0.0")

# CORS for local dev web app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Auth (JWT, demo mode) ----
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    try:
        scheme, token = authorization.split(" ", 1)
        if scheme.lower() != "bearer":
            raise ValueError("invalid scheme")
        return verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/auth/login", response_model=TokenResponse)
def auth_login(req: LoginRequest):
    token = issue_token(sub=req.email, email=req.email)
    return TokenResponse(access_token=token)

# ---- Simple model + SHAP setup (demo-grade) ----
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

# ---------- ML API payloads ----------
class AnomalyRequest(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    location_lat: float | None = None
    location_lng: float | None = None
    budget_cr: float | None = None
    delay_months: float | None = None
    status: Optional[str] = None
    risk: Optional[str] = None

class AnomalyResponse(BaseModel):
    is_anomaly: bool
    scores: Dict[str, float]
    message: Optional[str] = None

class ForecastResponse(BaseModel):
    points: list[dict]
    summary: dict

class SpatialRiskRequest(BaseModel):
    lat: float
    lng: float

class SpatialRiskResponse(BaseModel):
    risk: float
    cluster: Optional[str] = None

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

# ---------------- Projects CRUD ----------------

@app.get("/projects/{project_id}")
def get_project(project_id: int):
    try:
        supa = get_supabase()
        res = supa.table('projects').select('*').eq('id', project_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Project not found")
        r = res.data
        return {
            "id": r.get('id'),
            "code": r.get('code'),
            "name": r.get('name'),
            "location": [r.get('location_lat'), r.get('location_lng')],
            "budget_cr": r.get('budget_cr'),
            "status": r.get('status'),
            "risk": r.get('risk'),
            "delay_months": r.get('delay_months'),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")
@app.get("/analytics/summary")
def analytics_summary():
    # Minimal placeholder summary. Extend to aggregate from predictions table in Supabase.
    return {
        "total_projects": 0,
        "avg_delay": 0.0,
        "risk_histogram": {"low": 0, "med": 0, "high": 0},
    }

@app.put("/projects/{project_id}")
def update_project(project_id: int, p: ProjectIn, user=Depends(get_current_user)):
    try:
        supa = get_supabase()
        payload = p.dict()
        res = supa.table('projects').update(payload).eq('id', project_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Project not found or not updated")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, user=Depends(get_current_user)):
    try:
        supa = get_supabase()
        res = supa.table('projects').delete().eq('id', project_id).execute()
        if res.count == 0 and not res.data:
            # Supabase python may not return count; attempt to check by fetching after
            pass
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")

# ------------- Per-project Predict/Simulate -------------

@app.post("/projects/{project_id}/predict", response_model=PredictResponse)
def predict_for_project(project_id: int, req: PredictRequest, user=Depends(get_current_user)):
    # Reuse existing predict logic; project_id can be used for auditing later
    return predict(req)

@app.post("/projects/{project_id}/simulate", response_model=PredictResponse)
def simulate_for_project(project_id: int, req: PredictRequest, user=Depends(get_current_user)):
    return what_if(req)

MODEL, EXPLAINER, BG = _train_demo_model()

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
    # Risk in [0,1]
    risk = float(np.clip(MODEL.predict(x)[0], 0.01, 0.99))
    # Simple derived KPIs for demo
    delay_months = round(1.0 + 9.0 * risk, 2)
    overrun_cr = round(5.0 + 40.0 * risk, 2)
    shap_values = _explain(x)
    top = sorted(shap_values.items(), key=lambda kv: abs(kv[1]), reverse=True)[:2]
    explanation = f"Top drivers: {top[0][0]} ({top[0][1]:.2f}), {top[1][0]} ({top[1][1]:.2f})."
    return PredictResponse(
        delay_months=delay_months,
        overrun_cr=overrun_cr,
        risk_prob=risk,
        shap_values=shap_values,
        explanation=explanation,
    )

@app.post("/what-if", response_model=PredictResponse)
def what_if(req: PredictRequest):
    return predict(req)

@app.post("/forecast", response_model=PredictResponse)
def forecast(req: PredictRequest, user=Depends(get_current_user)):
    return predict(req)

# (Removed duplicate GET route for project predict; POST routes exist above)
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

# -------------------- ML Endpoints --------------------

@app.post("/ml/anomaly", response_model=AnomalyResponse)
def ml_anomaly(req: AnomalyRequest):
    """Simple z-score based anomaly check on numeric fields against projects table distribution.
    Flags values beyond |z| > 2.5 as anomalies. Non-blocking.
    """
    try:
        supa = get_supabase()
        res = supa.table('projects').select('budget_cr,delay_months').execute()
        rows = res.data or []
        df = pd.DataFrame(rows)
        scores: Dict[str, float] = {}
        is_anom = False
        msg_parts = []
        for col in ['budget_cr', 'delay_months']:
            if getattr(req, col) is None:
                continue
            s = pd.to_numeric(df.get(col), errors='coerce')
            mu = float(np.nanmean(s)) if len(s) else 0.0
            sd = float(np.nanstd(s) or 1.0)
            z = (float(getattr(req, col)) - mu) / (sd if sd else 1.0)
            scores[col] = float(z)
            if abs(z) > 2.5:
                is_anom = True
                msg_parts.append(f"{col} unusual (z={z:.2f})")
        return AnomalyResponse(is_anomaly=is_anom, scores=scores, message=', '.join(msg_parts) or None)
    except Exception as e:
        # Fail open: never block UI
        return AnomalyResponse(is_anomaly=False, scores={}, message=None)

@app.get("/ml/forecast", response_model=ForecastResponse)
def ml_forecast(user_id: Optional[str] = None):
    """Lightweight synthetic forecast using moving average over project count per pseudo-month.
    Replace with ARIMA/Prophet when dates are available.
    """
    try:
        supa = get_supabase()
        q = supa.table('projects').select('id,user_id,budget_cr').execute()
        data = q.data or []
        n = len(data)
        window = max(3, min(6, n // 4 or 3))
        series = [max(1, int(n * (0.6 + 0.4*np.sin(i/3.0)))) for i in range(12)]
        # moving average
        ma = []
        for i in range(len(series)):
            lo = max(0, i-window+1)
            ma.append(sum(series[lo:i+1]) / (i-lo+1))
        points = [{"t": i, "count": series[i], "ma": round(ma[i], 2)} for i in range(len(series))]
        return ForecastResponse(points=points, summary={"window": window, "total": n})
    except Exception:
        return ForecastResponse(points=[], summary={"window": 0, "total": 0})

@app.post("/ml/spatial-risk", response_model=SpatialRiskResponse)
def ml_spatial_risk(req: SpatialRiskRequest):
    """Heuristic spatial risk based on distance to a synthetic hotspot.
    Replace with GBM/regression trained on geo features.
    """
    # Hotspot near central India
    cx, cy = 22.0, 79.0
    d = np.sqrt((req.lat - cx)**2 + (req.lng - cy)**2)
    risk = float(np.clip(1.2 - 0.05*d, 0.05, 0.95))
    cluster = "hotspot" if d < 6 else ("medium" if d < 12 else "low")
    return SpatialRiskResponse(risk=risk, cluster=cluster)

@app.post("/projects", response_model=ProjectOut)
def create_project(p: ProjectIn, user=Depends(get_current_user)):
    try:
        supa = get_supabase()
        payload = p.dict()
        res = supa.table('projects').insert(payload).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Insert failed")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")
