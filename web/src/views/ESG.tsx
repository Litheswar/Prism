export default function ESG(){
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">ESG & Sustainability Insights</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <K label="CO₂ Saved" v="1,240 t"/>
        <K label="Green Material Usage" v="62%"/>
        <K label="Community Impact Index" v="78"/>
      </div>
      <div className="card h-64 mt-4">Comparison bars placeholder</div>
    </div>
  )
}
function K({label, v}:{label:string; v:string}){return <div className="card p-4"><div className="text-slate-500 text-sm">{label}</div><div className="text-2xl font-semibold">{v}</div></div>}
