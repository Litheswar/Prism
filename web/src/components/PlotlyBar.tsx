import createPlotlyComponent from 'react-plotly.js/factory'
import Plotly from 'plotly.js-dist-min'

const Plot = createPlotlyComponent(Plotly)

export function ShapBar({ data }: { data: Record<string, number> | undefined }){
  if(!data) return <div className="h-64 rounded bg-slate-100" />
  const keys = Object.keys(data)
  const vals = keys.map(k => data[k])
  return (
    <Plot
      data={[{
        type: 'bar',
        x: vals.map(v => Math.abs(v)),
        y: keys,
        orientation: 'h',
        marker: { color: '#007AFF' }
      }]}
      layout={{ margin: { l: 150, r: 20, t: 20, b: 30 }, height: 300, paper_bgcolor: 'white', plot_bgcolor: 'white' }}
      style={{ width: '100%', height: '100%' }}
      config={{ displayModeBar: false }}
    />
  )
}
