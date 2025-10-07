export default function Advisor(){
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">ProjectAI Advisor</h1>
      <div className="card p-4 mt-4 space-y-3">
        <div className="flex gap-2">
          <input className="flex-1 rounded-lg border" placeholder="Ask about delays, costs, mitigation..." />
          <button className="btn-primary">Send</button>
        </div>
        <div className="space-y-2">
          <div className="rounded-lg bg-slate-100 p-3 w-fit">Why is KN-01 high risk?</div>
          <div className="rounded-lg bg-accent-cyan/10 p-3 w-fit ml-auto">Top drivers: vendor backlog and weather impact. Suggest scheduling buffer and alternate vendor.</div>
        </div>
      </div>
    </div>
  )
}
