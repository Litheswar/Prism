import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('prism_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export async function login(email: string, password: string){
  const { data } = await api.post<{ access_token: string; token_type: string }>(`/auth/login`, { email, password })
  localStorage.setItem('prism_token', data.access_token)
  return data
}

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

export async function getProject(id: number) {
  const { data } = await api.get<Project>(`/projects/${id}`)
  return data
}

export async function updateProject(id: number, p: Project) {
  const payload = {
    code: p.code,
    name: p.name,
    location_lat: p.location_lat ?? p.location?.[0] ?? null,
    location_lng: p.location_lng ?? p.location?.[1] ?? null,
    budget_cr: p.budget_cr ?? null,
    status: p.status ?? null,
    risk: p.risk ?? null,
    delay_months: p.delay_months ?? null,
  }
  const { data } = await api.put<Project>(`/projects/${id}` , payload)
  return data
}

export async function deleteProject(id: number) {
  const { data } = await api.delete<{ ok: boolean }>(`/projects/${id}`)
  return data
}

export async function predictProject(id: number, payload: PredictPayload) {
  const { data } = await api.post<PredictResponse>(`/projects/${id}/predict`, payload)
  return data
}

export async function simulateProject(id: number, payload: PredictPayload) {
  const { data } = await api.post<PredictResponse>(`/projects/${id}/simulate`, payload)
  return data
}

export async function extractDocument(file: File) {
  // Mock implementation for document extraction
  // In a real implementation, this would call the backend /extract endpoint
  return {
    project_name: { value: "East Zone Power Line", confidence: 0.98 },
    budget_cr: { value: 18, confidence: 0.70 },
  }
}

export async function whatIf(payload: PredictPayload) {
  const { data } = await api.post<PredictResponse>('/what-if', payload)
  return data
}

// -------- ML helpers --------
export type AnomalyRequest = {
  code?: string
  name?: string
  location_lat?: number | null
  location_lng?: number | null
  budget_cr?: number | null
  delay_months?: number | null
  status?: string | null
  risk?: string | null
}

export type AnomalyResponse = {
  is_anomaly: boolean
  scores: Record<string, number>
  message?: string | null
}

export async function checkAnomaly(payload: AnomalyRequest) {
  const { data } = await api.post<AnomalyResponse>('/ml/anomaly', payload)
  return data
}

export type ForecastResponseLite = {
  points: Array<{ t: number; count: number; ma: number }>
  summary: Record<string, any>
}

export async function forecastMetrics() {
  const { data } = await api.get<ForecastResponseLite>('/ml/forecast')
  return data
}

export async function spatialRisk(lat: number, lng: number) {
  const { data } = await api.post<{ risk: number; cluster?: string }>('/ml/spatial-risk', { lat, lng })
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
