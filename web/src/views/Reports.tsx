export default function Reports(){
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="card p-4">
        <div className="text-sm text-slate-500">Generate & export project summaries (PDF/CSV)</div>
        <div className="mt-3 grid md:grid-cols-3 gap-3">
          <select className="rounded-lg border"><option>KN-01 PowerBase</option></select>
          <input className="rounded-lg border" placeholder="From" />
          <input className="rounded-lg border" placeholder="To" />
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn-primary">Generate PDF</button>
          <button className="rounded-lg border px-4 py-2">Export CSV</button>
        </div>
      </div>
      <div className="card h-64">Preview placeholder</div>
    </div>
  )
}
