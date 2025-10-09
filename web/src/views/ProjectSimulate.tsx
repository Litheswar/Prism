import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, simulateProject } from '@/lib/api'

export default function ProjectSimulate() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [simulationData, setSimulationData] = useState<any>(null)
  const [parameters, setParameters] = useState({
    labour_cost: 0.5,
    material_cost: 0.6,
    regulatory_delay: 0.2,
    vendor_reliability: 0.8,
    weather_impact: 0.4,
  })

  useEffect(() => {
    if (id) {
      loadProject()
    }
  }, [id])

  const loadProject = async () => {
    try {
      const data = await getProject(Number(id))
      setProject(data)
    } catch (error) {
      console.error('Failed to load project:', error)
    } finally {
      setLoading(false)
    }
  }

  const runSimulation = async () => {
    try {
      const result = await simulateProject(Number(id), { features: parameters })
      setSimulationData(result)
    } catch (error) {
      console.error('Simulation failed:', error)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!project) return <div className="p-8 text-center">Project not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/projects/${id}`)} className="text-slate-400 hover:text-white">
          ← Back to Project
        </button>
        <h1 className="text-2xl font-bold">{project.name} - Simulation</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Simulation Parameters</h3>
            <div className="space-y-4">
              {Object.entries(parameters).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm text-slate-400 mb-2 capitalize">
                    {key.replace('_', ' ')}: {Number(value).toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={value}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      [key]: Number(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={runSimulation}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-400 hover:to-blue-400"
          >
            🔮 Run Simulation
          </button>
        </div>

        <div className="space-y-6">
          {simulationData && (
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Simulation Results</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-400 text-sm">Risk Probability</div>
                    <div className="text-2xl font-bold text-red-400">{(simulationData.risk_prob * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Expected Delay</div>
                    <div className="text-2xl font-bold text-yellow-400">{simulationData.delay_months} months</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Cost Overrun</div>
                    <div className="text-2xl font-bold text-orange-400">₹{simulationData.overrun_cr} Cr</div>
                  </div>
                </div>

                {simulationData.explanation && (
                  <div>
                    <div className="text-slate-400 text-sm mb-2">Key Drivers</div>
                    <div className="text-white">{simulationData.explanation}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Parameter Effects</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Labour Cost Impact:</span>
                <span className="text-white">{(parameters.labour_cost * 15).toFixed(1)}% risk increase</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vendor Reliability:</span>
                <span className="text-green-400">{((1 - parameters.vendor_reliability) * 25).toFixed(1)}% risk reduction</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Weather Impact:</span>
                <span className="text-blue-400">{(parameters.weather_impact * 20).toFixed(1)}% delay risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
