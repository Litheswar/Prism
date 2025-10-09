import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, predictProject } from '@/lib/api'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!project) return <div className="p-8 text-center">Project not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/projects')} className="text-slate-400 hover:text-white">
          ← Back to Projects
        </button>
        <h1 className="text-2xl font-bold">{project.name}</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            <div className="space-y-3">
              <div><span className="text-slate-400">Code:</span> {project.code}</div>
              <div><span className="text-slate-400">Location:</span> {project.location?.join(', ')}</div>
              <div><span className="text-slate-400">Budget:</span> ₹{project.budget_cr} Cr</div>
              <div><span className="text-slate-400">Status:</span> {project.status}</div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/projects/${id}/simulate`)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-400 hover:to-blue-400"
          >
            🔮 Run Simulation
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded">
              📊 View Analytics
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded">
              📋 Generate Report
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded">
              ⚠️ View Risks
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
