import { Outlet, Link, useLocation } from 'react-router-dom'

export function AppShell() {
  const loc = useLocation()
  const nav = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/projects', label: 'My Projects' },
    { to: '/add-project', label: 'Add Project' },
    { to: '/risk-heatmap', label: 'Risk Heatmap' },
    { to: '/what-if', label: 'What-If Simulator' },
    { to: '/dependency-graph', label: 'Dependency Graph' },
    { to: '/esg', label: 'ESG Dashboard' },
    { to: '/insight-lens', label: 'Insight Lens' },
    { to: '/advisor', label: 'Smart Advisor' },
    { to: '/weather-impact', label: 'Weather Impact' },
    { to: '/reports', label: 'Reports' },
  ]
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-accent-cyan" />
            <span className="font-semibold">PRISM</span>
            <span className="text-slate-500 text-sm">POWERGRID Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <Link className="btn-primary" to="/login">Login</Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-6 py-6">
        <aside className="hidden md:block col-span-3 lg:col-span-2">
          <nav className="card p-3 space-y-1">
            {nav.map(n => (
              <Link key={n.to} to={n.to} className={`block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 ${loc.pathname===n.to? 'bg-slate-100 font-medium':''}`}>{n.label}</Link>
            ))}
          </nav>
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <Outlet />
        </main>
      </div>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Power Grid Corporation of India Ltd. PRISM v1.0
      </footer>
    </div>
  )
}
