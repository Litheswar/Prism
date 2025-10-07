import { RouteObject } from 'react-router-dom'
import { AppShell } from './ui/AppShell'
import Landing from './views/Landing'
import Login from './views/Login'
import Register from './views/Register'
import SelectRole from './views/SelectRole'
import Dashboard from './views/Dashboard'
import Admin from './views/Admin'
import Projects from './views/Projects'
import AddProject from './views/AddProject'
import RiskHeatmap from './views/RiskHeatmap'
import WhatIf from './views/WhatIf'
import DependencyGraph from './views/DependencyGraph'
import ESG from './views/ESG'
import InsightLens from './views/InsightLens'
import Advisor from './views/Advisor'
import WeatherImpact from './views/WeatherImpact'
import Reports from './views/Reports'

export const routes: RouteObject[] = [
  { path: '/', element: <Landing /> },
  {
    path: '/', element: <AppShell />, children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'select-role', element: <SelectRole /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'admin', element: <Admin /> },
      { path: 'projects', element: <Projects /> },
      { path: 'add-project', element: <AddProject /> },
      { path: 'risk-heatmap', element: <RiskHeatmap /> },
      { path: 'what-if', element: <WhatIf /> },
      { path: 'dependency-graph', element: <DependencyGraph /> },
      { path: 'esg', element: <ESG /> },
      { path: 'insight-lens', element: <InsightLens /> },
      { path: 'advisor', element: <Advisor /> },
      { path: 'weather-impact', element: <WeatherImpact /> },
      { path: 'reports', element: <Reports /> },
    ]
  }
]
