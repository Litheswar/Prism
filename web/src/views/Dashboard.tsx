import { useEffect, useState } from 'react'
import { usePredict } from '@/lib/hooks'
import { ShapBar } from '@/components/PlotlyBar'
import { forecastMetrics } from '@/lib/api'

export default function Dashboard(){
  const [forecast, setForecast] = useState<{ points: Array<{t:number;count:number;ma:number}>; summary: any } | null>(null)
  const [loadingForecast, setLoadingForecast] = useState(false)
  useEffect(() => {
    let mounted = true
    setLoadingForecast(true)
    forecastMetrics().then((res) => { if (mounted) setForecast(res) }).finally(() => setLoadingForecast(false))
    return () => { mounted = false }
  }, [])
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
    <div className="space-y-8">
      <section className="bg-gradient-to-b from-sky-50/70 to-white rounded-xl border border-sky-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sky-700 bg-sky-50 px-3 py-1 rounded-full text-xs">AI-Powered Insights</div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              <span className="text-slate-900">Dashboard</span>
            </h1>
            <p className="mt-1 text-slate-600 text-sm">Key metrics, SHAP feature importance and project trends</p>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-4 gap-4">
        <Kpi label="Total Projects" value="1" />
        <Kpi label="High Risk Projects" value={riskPct} />
        <Kpi label="Avg Expected Delay" value={delay} />
        <Kpi label="Avg Cost Overrun" value={overrun} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4 transition hover:shadow-lg hover:-translate-y-0.5">
          <div className="font-medium text-slate-800">Feature Importance (SHAP)</div>
          <div className="mt-2">
            <ShapBar data={data?.shap_values} />
          </div>
        </div>
        <div className="card p-4 transition hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div className="font-medium text-slate-800">Project Trends</div>
            <button
              className="btn text-sm border px-2 py-1 bg-white hover:bg-slate-50 disabled:opacity-50"
              disabled={loadingForecast}
              onClick={() => {
                setLoadingForecast(true)
                forecastMetrics().then(res => setForecast(res)).finally(() => setLoadingForecast(false))
              }}
            >{loadingForecast ? 'Refreshing…' : 'Refresh Forecast'}</button>
          </div>
          <div className="mt-2">
            {loadingForecast && <div className="h-64 grid place-items-center text-slate-500">Loading…</div>}
            {!loadingForecast && forecast && (
              <Trend points={forecast.points} />
            )}
            {!loadingForecast && !forecast && (
              <div className="h-64 grid place-items-center text-slate-500">No data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Kpi({label, value}:{label:string; value:string}){
  return (
    <div className="card p-4 transition hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-fuchsia-400 to-emerald-400" />
      <div className="text-slate-500 text-sm mt-1">{label}</div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function Trend({ points }:{ points: Array<{t:number;count:number;ma:number}> }){
  const max = Math.max(1, ...points.map(p => Math.max(p.count, p.ma)))
  return (
    <div className="h-64 flex items-end gap-1">
      {points.map(p => (
        <div key={p.t} className="flex flex-col justify-end" style={{height:'100%'}}>
          <div className="bg-sky-300 rounded-t w-3" style={{ height: `${(p.count/max)*100}%` }} title={`t${p.t}: ${p.count}`}/>
          <div className="bg-sky-700/60 rounded w-1 self-center" style={{ height: `${(p.ma/max)*100}%`, marginTop: '-8px' }} title={`MA: ${p.ma}`}/>
        </div>
      ))}
    </div>
  )
}
