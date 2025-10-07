export default function Landing(){
  return (
    <div className="bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-sky-700 bg-sky-50 px-3 py-1 rounded-full text-sm">AI-Powered Infrastructure Intelligence</span>
          <h1 className="mt-4 text-4xl font-extrabold">PRISM – Predicting Project Costs & Timelines</h1>
          <p className="mt-3 text-slate-600">AI-powered foresight for India's infrastructure projects. Predict delays and cost overruns before they happen.</p>
          <div className="mt-6 flex gap-3">
            <a href="/login" className="btn-primary">Get Started</a>
            <a href="/select-role" className="rounded-lg border px-4 py-2">Learn More</a>
          </div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-slate-500">Delay Risk Status</div>
          <div className="mt-1 text-green-600 font-semibold">Low</div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="card p-4"><div className="text-slate-500 text-sm">Cost Overrun</div><div className="text-2xl font-semibold">12%</div></div>
            <div className="card p-4"><div className="text-slate-500 text-sm">Savings</div><div className="text-2xl font-semibold">₹45Cr</div></div>
          </div>
          <div className="mt-6 h-2 rounded-full bg-slate-100"><div className="h-2 w-3/4 rounded-full bg-accent-cyan"/></div>
          <div className="mt-2 text-xs text-slate-500">ML Prediction Confidence: 94%</div>
        </div>
      </div>
    </div>
  )
}
