import { usePredict } from '@/lib/hooks'
import { ShapBar } from '@/components/PlotlyBar'

export default function Dashboard(){
  const { data, isLoading } = usePredict({
    features: {
      labour_cost: 0.5,
      material_cost: 0.5,
      regulatory_delay: 0.4,
      vendor_reliability: 0.6,
      weather_impact: 0.3,
    }
  })

  const delay = isLoading? '…' : `${data?.delay_months?.toFixed(2)} mo`
  const overrun = isLoading? '…' : `₹${data?.overrun_cr?.toFixed(0)} Cr`
  const riskPct = isLoading? '…' : `${Math.round((data?.risk_prob||0)*100)}%`

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <Kpi label="Total Projects" value="1" />
        <Kpi label="High Risk Projects" value={riskPct} />
        <Kpi label="Avg Expected Delay" value={delay} />
        <Kpi label="Avg Cost Overrun" value={overrun} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="font-medium">Feature Importance (SHAP)</div>
          <div className="mt-2">
            <ShapBar data={data?.shap_values} />
          </div>
        </div>
        <div className="card p-4">
          <div className="font-medium">Project Trends</div>
          <div className="mt-2 h-64 bg-slate-100 rounded"/>
        </div>
      </div>
    </div>
  )
}

function Kpi({label, value}:{label:string; value:string}){
  return (
    <div className="card p-4">
      <div className="text-slate-500 text-sm">{label}</div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}
