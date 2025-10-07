import { useEffect, useState } from 'react'
import { useProjects, useCreateProject } from '@/lib/hooks'

export default function Projects(){
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('prism_user_id') || '')
  useEffect(() => { localStorage.setItem('prism_user_id', userId || '') }, [userId])
  const { data, isLoading } = useProjects(userId || undefined)
  const createMut = useCreateProject(userId || undefined)

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
              return (
                <tr key={p.id || p.code} className="border-t">
                  <td className="px-4 py-2 font-medium">{p.code}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{loc?.[0]}, {loc?.[1]}</td>
                  <td className="px-4 py-2">{p.budget_cr ? `₹${p.budget_cr} Cr` : '-'}</td>
                  <td className="px-4 py-2"><span className="rounded bg-slate-100 px-2 py-1">{p.status || '-'}</span></td>
                  <td className="px-4 py-2"><span className="rounded bg-amber-100 px-2 py-1">{p.risk || '-'}</span></td>
                  <td className="px-4 py-2">{p.delay_months ? `${p.delay_months} mo` : '-'}</td>
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
