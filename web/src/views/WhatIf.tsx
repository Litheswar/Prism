import React, { useEffect, useState } from 'react'
import { useWhatIf } from '@/lib/hooks'
import { ShapBar } from '@/components/PlotlyBar'

export default function WhatIf(){
  const [labour, setLabour] = useState(0.5)
  const [material, setMaterial] = useState(0.5)
  const [regDelay, setRegDelay] = useState(0.4)
  const [vendor, setVendor] = useState(0.6)
  const [weather, setWeather] = useState(0.3)
  const mut = useWhatIf()

  useEffect(() => {
    const t = setTimeout(() => {
      mut.mutate({ features: {
        labour_cost: labour,
        material_cost: material,
        regulatory_delay: regDelay,
        vendor_reliability: vendor,
        weather_impact: weather,
      }})
    }, 200)
    return () => clearTimeout(t)
  }, [labour, material, regDelay, vendor, weather])

  const delay = mut.data? `${mut.data.delay_months.toFixed(2)} mo` : '—'
  const overrun = mut.data? `₹${mut.data.overrun_cr.toFixed(0)} Cr` : '—'

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">What-If Analysis</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card p-4 space-y-4">
          <Slider label="Labour Cost" value={labour} set={setLabour} />
          <Slider label="Material Cost" value={material} set={setMaterial} />
          <Slider label="Regulatory Delay" value={regDelay} set={setRegDelay} />
          <Slider label="Vendor Reliability" value={vendor} set={setVendor} />
          <Slider label="Weather Impact" value={weather} set={setWeather} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4"><div className="text-sm text-slate-500">Predicted Delay</div><div className="text-2xl font-semibold">{delay}</div></div>
            <div className="card p-4"><div className="text-sm text-slate-500">Cost Overrun</div><div className="text-2xl font-semibold">{overrun}</div></div>
          </div>
          <div className="card p-4">
            <div className="font-medium">Feature Contribution (SHAP)</div>
            <ShapBar data={mut.data?.shap_values} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Slider({label, value, set}:{label:string; value:number; set:(n:number)=>void}){
  return (
    <div>
      <label className="block text-sm">{label}: {(value*100).toFixed(0)}%</label>
      <input
        type="range"
        className="w-full"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => set(parseFloat(e.target.value))}
      />
    </div>
  )
}
