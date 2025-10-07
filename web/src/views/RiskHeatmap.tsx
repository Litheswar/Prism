import MapChoropleth from '@/components/MapChoropleth'
export default function RiskHeatmap(){
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Project Risk Heatmap</h1>
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <div className="font-medium">Filters</div>
            <select className="mt-3 w-full rounded-lg border"><option>All Regions</option></select>
            <select className="mt-2 w-full rounded-lg border"><option>All Project Types</option></select>
            <select className="mt-2 w-full rounded-lg border"><option>Last 12 months</option></select>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Summary label="Projects at Risk" value="12"/>
            <Summary label="Average Delay (days)" value="37"/>
            <Summary label="Total Projects" value="128"/>
          </div>
        </div>
        <div className="lg:col-span-3 card p-2 min-h-[520px]">
          <div className="h-[500px]">
            <MapChoropleth />
          </div>
        </div>
      </div>
    </div>
  )
}

function Summary({label, value}:{label:string; value:string}){
  return (
    <div className="card p-4">
      <div className="text-slate-500 text-sm">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  )
}
