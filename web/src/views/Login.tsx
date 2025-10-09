import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as jwtLogin } from '@/lib/api'

export default function Login(){
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const signInPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null); setLoading(true)
    try {
      await jwtLogin(email, password)
    } catch (e:any) {
      setLoading(false)
      setErr(e?.response?.data?.detail || e?.message || 'Login failed')
      return
    }
    setLoading(false)
    nav('/projects')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center">Welcome to PRISM</h2>
        {err && <div className="mt-4 text-sm text-red-600">{err}</div>}
        <div className="my-6 h-px bg-slate-200"/>
        <form className="space-y-3" onSubmit={signInPassword}>
          <input className="w-full rounded-lg border px-3 py-2" placeholder="Email" value={email} onChange={e=> setEmail(e.target.value)} />
          <input className="w-full rounded-lg border px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=> setPassword(e.target.value)} />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <div className="mt-3 text-center text-sm text-slate-500">Forgot password?</div>
      </div>
    </div>
  )
}
