import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-12 text-center">
      <p className="font-mono text-xs text-ink/50">Valencia, Spain</p>

      <h1 className="mt-2 font-serif text-4xl text-ink">
        Flame Fusion
      </h1>

      <p className="mt-4 max-w-md text-ink/70">
        A digital ordering and operations platform for small restaurants —
        QR ordering, live order management, and business intelligence in one
        place.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/menu/flame-fusion"
          className="rounded-md bg-valencia px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-valencia/90"
        >
          View the customer menu
        </Link>

        <Link
          href="/owner-login"
          className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-line/20"
        >
          Owner login
        </Link>
      </div>
    </main>
  )
}