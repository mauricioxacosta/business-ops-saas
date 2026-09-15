export default function Loading() {
  return (
    <div className="min-h-screen bg-admin-bg font-admin md:flex">
      <div className="hidden w-56 shrink-0 border-r border-black/5 bg-white md:block" />
      <div className="flex-1 p-4 sm:p-8">
        <div className="h-6 w-56 animate-pulse rounded bg-black/5" />
        <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-black/5" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
        <div className="mt-10 h-6 w-40 animate-pulse rounded bg-black/5" />
        <div className="mt-4 h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
    </div>
  )
}