import { useEffect, useState } from 'react'
import { useProjects, useCreateProject } from '@/lib/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProject, updateProject, predict } from '@/lib/api'

export default function Projects(){
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('prism_user_id') || '')
  useEffect(() => { localStorage.setItem('prism_user_id', userId || '') }, [userId])
  const { data, isLoading } = useProjects(userId || undefined)
  const createMut = useCreateProject(userId || undefined)
  const qc = useQueryClient()
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects', userId || undefined] })
    }
  })

  // Predict and save risk for a project
  const predictSaveMut = useMutation({
    mutationFn: async (p: any) => {
      const budget = typeof p.budget_cr === 'number' ? p.budget_cr : 0
      const delay = typeof p.delay_months === 'number' ? p.delay_months : 0
      const features = {
        labour_cost: 0.4,
        material_cost: Math.min(1, budget / 100),
        regulatory_delay: Math.min(1, delay / 12),
        vendor_reliability: 0.6,
        weather_impact: 0.3,
      }
      const res = await predict({ features })
      const prob = res.risk_prob || 0
      const label: 'Low'|'Medium'|'High' = prob < 0.33 ? 'Low' : prob < 0.66 ? 'Medium' : 'High'
      await updateProject(p.id, { ...p, risk: label })
      return { id: p.id, prob, label }
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['projects', userId || undefined] })
    }
  })

  // Predicted risk annotations per project id
  const [riskMap, setRiskMap] = useState<Record<number, { prob: number; label: 'Low'|'Medium'|'High' }>>({})
  useEffect(() => {
    const items = (data || []).filter((p:any) => p?.id)
    if (items.length === 0) { setRiskMap({}); return }
    let cancelled = false
    ;(async () => {
      const entries: Array<[number, { prob:number; label:'Low'|'Medium'|'High' }]> = []
      for (const p of items) {
        try {
          // Simple feature mapping from project attributes
          const budget = typeof p.budget_cr === 'number' ? p.budget_cr : 0
          const delay = typeof p.delay_months === 'number' ? p.delay_months : 0
          const features = {
            labour_cost: 0.4,
            material_cost: Math.min(1, budget / 100),
            regulatory_delay: Math.min(1, delay / 12),
            vendor_reliability: 0.6,
            weather_impact: 0.3,
          }
          const res = await predict({ features })
          const prob = res.risk_prob || 0
          const label: 'Low'|'Medium'|'High' = prob < 0.33 ? 'Low' : prob < 0.66 ? 'Medium' : 'High'
          entries.push([p.id as number, { prob, label }])
        } catch {}
      }
      if (!cancelled) setRiskMap(Object.fromEntries(entries))
    })()
    return () => { cancelled = true }
  }, [data])
  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateProject(id, payload),
    onSuccess: () => {
      setEditId(null)
      setEditRow(null)
      qc.invalidateQueries({ queryKey: ['projects', userId || undefined] })
    }
  })

  const [form, setForm] = useState({
    code: '',
    name: '',
    location_lat: '',
    location_lng: '',
    budget_cr: '',
    status: '',
    risk: '',
    delay_months: '',
  })

  // Inline edit state and helpers
  const [editId, setEditId] = useState<number | null>(null)
  const [editRow, setEditRow] = useState<any>(null)

  const startEdit = (p: any) => {
    setEditId(p.id ?? null)
    setEditRow({
      code: p.code || '',
      name: p.name || '',
      location_lat: (p.location?.[0] ?? p.location_lat ?? '') as any,
      location_lng: (p.location?.[1] ?? p.location_lng ?? '') as any,
      budget_cr: p.budget_cr ?? '',
      status: p.status ?? '',
      risk: p.risk ?? '',
      delay_months: p.delay_months ?? '',
    })
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditRow(null)
  }

  const saveEdit = (id: number) => {
    if (!editRow) return
    const payload = {
      code: String(editRow.code ?? ''),
      name: String(editRow.name ?? ''),
      location_lat: editRow.location_lat === '' ? null : parseFloat(String(editRow.location_lat)),
      location_lng: editRow.location_lng === '' ? null : parseFloat(String(editRow.location_lng)),
      budget_cr: editRow.budget_cr === '' ? null : parseFloat(String(editRow.budget_cr)),
      status: editRow.status || null,
      risk: editRow.risk || null,
      delay_months: editRow.delay_months === '' ? null : parseFloat(String(editRow.delay_months)),
    }
    updateMut.mutate({ id, payload })
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(!form.code || !form.name) return
    createMut.mutate({
      code: form.code,
      name: form.name,
      location_lat: form.location_lat ? parseFloat(form.location_lat) : null,
      location_lng: form.location_lng ? parseFloat(form.location_lng) : null,
      budget_cr: form.budget_cr ? parseFloat(form.budget_cr) : null,
      status: form.status || null,
      risk: form.risk || null,
      delay_months: form.delay_months ? parseFloat(form.delay_months) : null,
    })
    setForm({ code:'', name:'', location_lat:'', location_lng:'', budget_cr:'', status:'', risk:'', delay_months:'' })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <div className="card p-4 flex gap-3 items-end">
        <div className="w-64">
          <Input label="User ID (scope)" value={userId} onChange={setUserId} />
        </div>
        <div className="text-xs text-slate-500">Projects list and creation are scoped to this user_id. Leave blank to see all (if allowed by policies).</div>
      </div>

      <form onSubmit={onSubmit} className="card p-4 grid lg:grid-cols-6 gap-3 items-end">
        <Input label="Code" value={form.code} onChange={v=> setForm(s=>({...s, code:v}))} required />
        <Input label="Name" value={form.name} onChange={v=> setForm(s=>({...s, name:v}))} required />
        <Input label="Lat" value={form.location_lat} onChange={v=> setForm(s=>({...s, location_lat:v}))} />
        <Input label="Lng" value={form.location_lng} onChange={v=> setForm(s=>({...s, location_lng:v}))} />
        <Input label="Budget (Cr)" value={form.budget_cr} onChange={v=> setForm(s=>({...s, budget_cr:v}))} />
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={createMut.isPending}>Add</button>
        </div>
        <Input label="Status" value={form.status} onChange={v=> setForm(s=>({...s, status:v}))} />
        <Input label="Risk" value={form.risk} onChange={v=> setForm(s=>({...s, risk:v}))} />
        <Input label="Delay (mo)" value={form.delay_months} onChange={v=> setForm(s=>({...s, delay_months:v}))} />
      </form>

      <div className="flex items-center gap-3">
        <button
          className="btn btn-primary"
          onClick={async () => {
            const items = (data || []).filter((p:any)=>p?.id)
            for (const p of items) {
              await predictSaveMut.mutateAsync(p)
            }
          }}
          disabled={predictSaveMut.isPending}
        >
          {predictSaveMut.isPending ? 'Updating risks…' : 'Refresh All Risks'}
        </button>
        <span className="text-xs text-slate-500">Uses ML model to compute risk and saves to DB</span>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Budget</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Risk</th>
              <th className="px-4 py-2 text-left">Delay</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td className="px-4 py-3" colSpan={7}>Loading…</td></tr>
            )}
            {!isLoading && (data||[]).length===0 && (
              <tr><td className="px-4 py-3" colSpan={7}>No projects</td></tr>
            )}
            {(data||[]).map((p:any) => {
              const loc = p.location || [p.location_lat, p.location_lng]
              const isEditing = editId === p.id
              return (
                <tr key={p.id || p.code} className="border-t align-top">
                  <td className="px-4 py-2 font-medium">
                    {isEditing ? (
                      <input className="input w-36" value={editRow.code} onChange={e=> setEditRow((s:any)=>({...s, code:e.target.value}))} />
                    ) : p.code}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input className="input w-48" value={editRow.name} onChange={e=> setEditRow((s:any)=>({...s, name:e.target.value}))} />
                    ) : p.name}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input className="input w-28" placeholder="Lat" value={editRow.location_lat}
                          onChange={e=> setEditRow((s:any)=>({...s, location_lat:e.target.value}))} />
                        <input className="input w-28" placeholder="Lng" value={editRow.location_lng}
                          onChange={e=> setEditRow((s:any)=>({...s, location_lng:e.target.value}))} />
                      </div>
                    ) : (
                      <>{loc?.[0]}, {loc?.[1]}</>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input className="input w-28" value={editRow.budget_cr}
                        onChange={e=> setEditRow((s:any)=>({...s, budget_cr:e.target.value}))} />
                    ) : (p.budget_cr ? `₹${p.budget_cr} Cr` : '-')}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input className="input w-28" value={editRow.status}
                        onChange={e=> setEditRow((s:any)=>({...s, status:e.target.value}))} />
                    ) : (<span className="rounded bg-slate-100 px-2 py-1">{p.status || '-'}</span>)}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input className="input w-28" value={editRow.risk}
                        onChange={e=> setEditRow((s:any)=>({...s, risk:e.target.value}))} />
                    ) : (
                      <RiskBadge label={riskMap[p.id]?.label || p.risk || '-'} prob={riskMap[p.id]?.prob} />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input className="input w-20" value={editRow.delay_months}
                        onChange={e=> setEditRow((s:any)=>({...s, delay_months:e.target.value}))} />
                    ) : (p.delay_months ? `${p.delay_months} mo` : '-')}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                            onClick={() => p.id && saveEdit(p.id)}
                            disabled={!p.id || updateMut.isPending}
                          >Save</button>
                          <button
                            className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                            onClick={cancelEdit}
                          >Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                            onClick={() => startEdit(p)}
                          >Edit</button>
                          <button
                            className="px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50"
                            onClick={() => predictSaveMut.mutate(p)}
                            disabled={!p.id || predictSaveMut.isPending}
                          >Predict & Save Risk</button>
                          <button
                            className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                            onClick={() => p.id && deleteMut.mutate(p.id)}
                            disabled={!p.id || deleteMut.isPending}
                          >Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Input({label, value, onChange, required}:{label:string; value:string; onChange:(v:string)=>void; required?:boolean}){
  return (
    <label className="text-sm">
      <div className="text-slate-600 mb-1">{label}{required && <span className="text-red-500">*</span>}</div>
      <input className="input" value={value} onChange={e=> onChange(e.target.value)} required={required} />
    </label>
  )
}

function RiskBadge({ label, prob }: { label: string; prob?: number }){
  const l = (label || '').toLowerCase()
  let cls = 'bg-slate-100 text-slate-700'
  if (l === 'high') cls = 'bg-red-100 text-red-700'
  else if (l === 'medium' || l === 'med') cls = 'bg-amber-100 text-amber-700'
  else if (l === 'low') cls = 'bg-emerald-100 text-emerald-700'
  const title = typeof prob === 'number' ? `${Math.round(prob*100)}%` : undefined
  return <span className={`rounded px-2 py-1 ${cls}`} title={title}>{label}</span>
}
