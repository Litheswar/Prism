export default function Admin(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-4">Total Projects</div>
        <div className="card p-4">At-Risk %</div>
        <div className="card p-4">Avg Delay</div>
        <div className="card p-4">Avg Overrun</div>
      </div>
    </div>
  )
}
