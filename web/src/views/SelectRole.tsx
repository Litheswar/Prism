export default function SelectRole(){
  return (
    <div className="mx-auto max-w-4xl py-10">
      <h2 className="text-2xl font-semibold">Choose your view</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <a href="/dashboard" className="card p-6 hover:shadow-hover">
          <div className="text-lg font-semibold">Project Manager</div>
          <p className="text-slate-600 text-sm mt-2">Work on projects, predictions and insights.</p>
        </a>
        <a href="/admin" className="card p-6 hover:shadow-hover">
          <div className="text-lg font-semibold">Admin</div>
          <p className="text-slate-600 text-sm mt-2">Analytics, users, model config and data.</p>
        </a>
      </div>
    </div>
  )
}
