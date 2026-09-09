export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'

export default async function DashboardPage() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startOfToday } },
    include: { items: true },
  })

  const revenue = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) => itemSum + Number(item.priceEach) * item.quantity,
        0
      ),
    0
  )

  const itemCounts: Record<string, number> = {}
  for (const order of orders) {
    for (const item of order.items) {
      itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.quantity
    }
  }

  const topItemIds = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id)

  const topMenuItems = await prisma.menuItem.findMany({
    where: { id: { in: topItemIds } },
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const menuUrl = `${siteUrl}/menu/flame-fusion`
  const qrDataUrl = await QRCode.toDataURL(menuUrl, {
    margin: 1,
    color: { dark: '#2B2420', light: '#FBF6EE' },
  })

  const topItems = topItemIds.map((id) => {
    const menuItem = topMenuItems.find((m) => m.id === id)
    return {
      name: menuItem?.name ?? 'Unknown',
      quantity: itemCounts[id],
    }
  })

  return (
    <main className="min-h-screen bg-charcoal px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl text-cream">Dashboard</h1>

        <div className="mt-8 grid grid-cols-2 gap-5">
          <div className="rounded-lg bg-charcoal-card p-6">
            <p className="text-sm text-cream/50">Today&apos;s revenue</p>
            <p className="mt-2 font-mono text-3xl text-cream">£{revenue.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-charcoal-card p-6">
            <p className="text-sm text-cream/50">Orders today</p>
            <p className="mt-2 font-mono text-3xl text-cream">{orders.length}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-lg bg-charcoal-card p-6">
            <h2 className="font-serif text-lg text-cream">Menu QR code</h2>
            <div className="mt-4 inline-block rounded-md bg-paper p-3">
              <img src={qrDataUrl} alt="QR code linking to your menu" width={160} height={160} />
            </div>
            <p className="mt-3 font-mono text-xs text-cream/40">{menuUrl}</p>
          </div>

          <div className="rounded-lg bg-charcoal-card p-6">
            <h2 className="font-serif text-lg text-cream">Top items today</h2>
            {topItems.length === 0 ? (
              <p className="mt-4 text-sm text-cream/50">No orders yet today.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {topItems.map((item) => (
                  <li key={item.name} className="flex justify-between text-sm text-cream/90">
                    <span>{item.name}</span>
                    <span className="font-mono text-cream/60">{item.quantity} sold</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}