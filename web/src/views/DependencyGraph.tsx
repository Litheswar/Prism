export default function DependencyGraph(){
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Project Interdependency Graph</h1>
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 card h-[520px] flex items-center justify-center bg-slate-100 text-slate-500">Network graph placeholder</div>
        <aside className="card p-4 space-y-3">
          <div className="font-medium">Insights</div>
          <div>1. KN-04 most interlinked</div>
          <div>2. KN-09 shared vendors</div>
          <div>3. KN-01 timing cascade risk</div>
        </aside>
      </div>
    </div>
  )
}
