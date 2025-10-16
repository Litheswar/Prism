export default function Landing(){
  return (
    <div className="bg-gradient-to-b from-sky-50 to-white">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="PRISM" className="h-6 w-6" />
            <div className="flex flex-col leading-4">
              <span className="font-bold tracking-wide">PRISM</span>
              <span className="text-xs text-slate-500">POWERGRID Analytics</span>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <button className="btn border border-slate-200 bg-white hover:bg-slate-50" onClick={() => window.history.back()} title="Back">←</button>
              <button className="btn border border-slate-200 bg-white hover:bg-slate-50" onClick={() => window.history.forward()} title="Forward">→</button>
            </div>
          </div>
          <div>
            <a href="/login" className="btn btn-primary">Login / Register</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-sky-700 bg-sky-50 px-3 py-1 rounded-full text-sm">AI-Powered Infrastructure Intelligence</span>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight">
            <span className="block text-slate-900">PRISM</span>
            <span className="block text-sky-700">Predicting Project Costs &amp; Timelines</span>
          </h1>
          <p className="mt-4 text-slate-700 text-lg">AI-powered foresight for India's infrastructure projects. Predict delays and cost overruns before they happen.</p>
          <div className="mt-8 flex gap-3">
            <a href="/login" className="btn-primary">Get Started →</a>
            <a href="https://www.powergrid.in/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-sky-200 text-sky-700 px-4 py-2 hover:bg-sky-50">Learn More</a>
          </div>
        </div>

        <div className="relative">
          <div className="card p-6 shadow-xl">
            <div className="text-sm text-slate-500">Delay Risk Status</div>
            <div className="mt-1 inline-flex items-center gap-2 text-green-600 font-semibold text-xl">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" /> Low
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg p-4 bg-sky-50 border border-sky-100">
                <div className="text-slate-500 text-xs">Cost Overrun</div>
                <div className="text-2xl font-semibold text-sky-700">12%</div>
              </div>
              <div className="rounded-lg p-4 bg-fuchsia-50 border border-fuchsia-100">
                <div className="text-slate-500 text-xs">Savings</div>
                <div className="text-2xl font-semibold text-fuchsia-700">₹45Cr</div>
              </div>
              <div className="rounded-lg p-4 bg-emerald-50 border border-emerald-100">
                <div className="text-slate-500 text-xs">On-Time</div>
                <div className="text-2xl font-semibold text-emerald-700">88%</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-xs text-slate-500 mb-1">ML Prediction Confidence:</div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-2 w-3/4 rounded-full bg-sky-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat value="2,500+" label="Projects Analyzed" />
          <Stat value="94%" label="Prediction Accuracy" />
          <Stat value="₹2000Cr" label="Cost Savings" />
          <Stat value="28%" label="Time Reduction" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">Intelligent Project Management</h2>
          <p className="mt-2 text-slate-600">Leverage advanced ML models to gain unprecedented visibility into your infrastructure projects</p>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard title="Delay Prediction" desc="ML models predict project delays with high accuracy" icon="📈" />
            <FeatureCard title="Cost Analytics" desc="Real-time cost overrun probability and forecasting" icon="📊" />
            <FeatureCard title="Risk Assessment" desc="Comprehensive risk scoring across all project parameters" icon="🛡️" />
            <FeatureCard title="What-If Simulator" desc="Test scenarios and optimize project parameters" icon="🎯" />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-sky-500 to-teal-400 py-14">
        <div className="mx-auto max-w-7xl px-6 text-center text-white">
          <h3 className="text-3xl font-bold">Ready to Transform Your Project Management?</h3>
          <p className="mt-2 text-white/90">Join POWERGRID's intelligent infrastructure platform today</p>
          <a href="/login" className="inline-flex mt-6 btn-primary bg-white text-sky-700 hover:bg-white/90">Start Analyzing Projects →</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-sky-500" />
              <div className="font-semibold">PRISM</div>
            </div>
            <p className="mt-3 text-sm text-slate-400">AI-powered project analytics for India's power infrastructure</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Platform</div>
            <ul className="space-y-1 text-sm text-slate-400">
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/projects" className="hover:text-white">Analytics</a></li>
              <li><a href="/reports" className="hover:text-white">Reports</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Company</div>
            <ul className="space-y-1 text-sm text-slate-400">
              <li><a className="hover:text-white">About POWERGRID</a></li>
              <li><a className="hover:text-white">Contact</a></li>
              <li><a className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Legal</div>
            <ul className="space-y-1 text-sm text-slate-400">
              <li><a className="hover:text-white">Privacy Policy</a></li>
              <li><a className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          © 2024 Power Grid Corporation of India Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function Stat({ value, label }:{ value:string; label:string }){
  return (
    <div className="card p-6 text-center">
      <div className="text-3xl font-extrabold text-sky-700">{value}</div>
      <div className="mt-1 text-slate-700">{label}</div>
    </div>
  )
}

function FeatureCard({ title, desc, icon }:{ title:string; desc:string; icon:string }){
  return (
    <div className="card p-6 h-full">
      <div className="text-2xl">{icon}</div>
      <div className="mt-3 font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </div>
  )
}
