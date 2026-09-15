export default function Loading() {
  return (
    <div className="min-h-screen bg-admin-bg font-admin md:flex">
      <div className="hidden w-56 shrink-0 border-r border-black/5 bg-white md:block" />
      <div className="flex-1 p-4 sm:p-8">
        <div className="h-6 w-32 animate-pulse rounded bg-black/5" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  )
}