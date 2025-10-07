export default function Register(){
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center">Create PRISM Account</h2>
        <form className="mt-6 space-y-3">
          <input className="w-full rounded-lg border" placeholder="Organization" />
          <input className="w-full rounded-lg border" placeholder="Email" />
          <input className="w-full rounded-lg border" type="password" placeholder="Password" />
          <select className="w-full rounded-lg border"><option>Project Manager</option><option>Admin</option></select>
          <button className="btn-primary w-full">Register</button>
        </form>
      </div>
    </div>
  )
}
