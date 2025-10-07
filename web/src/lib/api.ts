import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export type PredictPayload = {
  project_id?: string
  features: Record<string, number>
}

export type PredictResponse = {
  delay_months: number
  overrun_cr: number
  risk_prob: number
  shap_values?: Record<string, number>
  explanation?: string
}

export async function predict(payload: PredictPayload) {
  const { data } = await api.post<PredictResponse>('/predict', payload)
  return data
}

export async function whatIf(payload: PredictPayload) {
  const { data } = await api.post<PredictResponse>('/what-if', payload)
  return data
}

export type Project = {
  id?: number
  code: string
  name: string
  location?: [number | null, number | null]
  location_lat?: number | null
  location_lng?: number | null
  budget_cr?: number | null
  status?: string | null
  risk?: string | null
  delay_months?: number | null
}

export async function getProjects(userId?: string) {
  const { data } = await api.get<Project[]>('/projects', { params: userId ? { user_id: userId } : {} })
  return data
}

export async function createProject(p: Project, userId?: string) {
  const payload = {
    user_id: userId,
    code: p.code,
    name: p.name,
    location_lat: p.location_lat ?? p.location?.[0] ?? null,
    location_lng: p.location_lng ?? p.location?.[1] ?? null,
    budget_cr: p.budget_cr ?? null,
    status: p.status ?? null,
    risk: p.risk ?? null,
    delay_months: p.delay_months ?? null,
  }
  const { data } = await api.post<Project>('/projects', payload)
  return data
}
