import Link from 'next/link'
import AdminLogoutButton from './AdminLogoutButton'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '/orders',
    label: 'Orders',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    href: '/inventory',
    label: 'Inventory',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    href: '/reports',
    label: 'Reports',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]

export default function OwnerLayout({
  children,
  active,
}: {
  children: React.ReactNode
  active: 'dashboard' | 'orders' | 'inventory' | 'reports'
}) {
  return (
    <div className="flex min-h-screen bg-admin-bg font-admin">
      <aside className="fixed inset-y-0 left-0 w-56 border-r border-black/5 bg-white px-4 py-6">
        <p className="px-2 font-semibold text-admin-ink">Flame Fusion</p>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === `/${active}`
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-admin-accent/10 text-admin-accent'
                    : 'text-admin-ink/60 hover:bg-black/5'
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="ml-56 flex-1">
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-8 py-4">
          <h1 className="font-semibold text-admin-ink">Flame Fusion Admin</h1>
          <AdminLogoutButton />
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}