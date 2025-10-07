# Prism
This application will be used by Ministry of Power (POWERGRID) to predict project delays and cost overruns.

## Monorepo Layout
- `api/` – FastAPI service with ML dependencies and stub endpoints (`/predict`, `/what-if`, `/extract`, `/projects`).
- `web/` – React + Vite + Tailwind PWA with all pages (Landing, Login, Dashboard, Projects, Add Project, Risk Heatmap, What‑If, Dependency Graph, ESG, Insight Lens, Advisor, Weather Impact, Reports).
- `streamlit_app/` – Optional Streamlit demo dashboard.

## Prerequisites
- Python 3.11+
- Node.js 18+ and npm

## Setup & Run

### 1) Backend API (FastAPI)
```bash
python -m venv .venv
./.venv/Scripts/activate  # Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r api/requirements.txt
uvicorn api.main:app --reload --port 8000
```
API available at http://localhost:8000 (health: `/health`).

### 2) Web App (React + Vite + Tailwind)
```bash
cd web
npm install
npm install -D @tailwindcss/forms
npm run dev
```
Web runs at http://localhost:5173.

### 3) Streamlit (optional)
```bash
pip install -r streamlit_app/requirements.txt
streamlit run streamlit_app/app.py
```

## Configuration
- Copy `api/.env.example` to `api/.env` and set Supabase keys if integrating a database later.
- Frontend expects API at `http://localhost:8000`; swap with proxy or env if needed.

## Notes
- Current UI follows POWERGRID enterprise theme based on shared mockups.
- ML endpoints return deterministic placeholders ready to be wired to real models.
