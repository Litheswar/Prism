export default function AddProject(){
  return (
    <div className="space-y-6">
      <a href="/projects" className="text-sm text-slate-500">← Back to Projects</a>
      <h1 className="text-2xl font-semibold">Create New Project</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <section className="card p-4">
            <div className="text-slate-700 font-medium">Upload Project Document</div>
            <div className="mt-2 text-sm text-slate-500">AI will extract details automatically from PDF, Excel, or Word files</div>
            <div className="mt-4 border-2 border-dashed rounded-lg p-8 text-center">Drop file here or <span className="text-accent-cyan">choose</span></div>
          </section>

          <section className="card p-4">
            <div className="text-slate-700 font-medium">Project Info</div>
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <input className="rounded-lg border" placeholder="Project Name" />
              <input className="rounded-lg border" placeholder="Project Code" />
              <select className="rounded-lg border md:col-span-2">
                <option>Transmission</option><option>Substation</option><option>Distribution</option><option>Renewable</option><option>Other</option>
              </select>
            </div>
          </section>

          <section className="card p-4">
            <div className="text-slate-700 font-medium">Budget & Timeline</div>
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              <input className="rounded-lg border" placeholder="Budget (Cr)" />
              <input className="rounded-lg border" placeholder="Start Date" />
              <input className="rounded-lg border" placeholder="Expected Completion" />
            </div>
          </section>

          <section className="card p-4">
            <div className="text-slate-700 font-medium">Advanced Parameters</div>
            <div className="mt-3 space-y-3">
              <label className="block text-sm">Vendor Reliability: 70%</label>
              <input type="range" className="w-full" />
              <label className="block text-sm">Complexity Rating: 5/10</label>
              <input type="range" className="w-full" />
            </div>
          </section>
        </div>
        <aside className="space-y-4">
          <section className="card p-4">
            <div className="font-medium">Live Project Summary</div>
            <div className="mt-2 text-sm">Completion 0%</div>
            <div className="mt-2 h-2 rounded bg-slate-100"><div className="h-2 w-1/5 rounded bg-accent-cyan"/></div>
          </section>
          <button className="btn-primary w-full">Create Project</button>
        </aside>
      </div>
    </div>
  )
}
