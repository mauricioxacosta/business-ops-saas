export default function Loading() {
  return (
    <div className="min-h-screen bg-admin-bg font-admin md:flex">
      <div className="hidden w-56 shrink-0 border-r border-black/5 bg-white md:block" />
      <div className="flex-1 p-4 sm:p-8">
        <div className="h-6 w-40 animate-pulse rounded bg-black/5" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
          <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    </div>
  )
}