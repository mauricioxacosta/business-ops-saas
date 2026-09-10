export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'
import OwnerLayout from '../components/OwnerLayout'
import DashboardCharts from '../components/DashboardCharts'

export default async function DashboardPage() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startOfToday } },
    include: { items: true },
    orderBy: { createdAt: 'asc' },
  })

  const revenue = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((s, item) => s + Number(item.priceEach) * item.quantity, 0),
    0
  )

  const avgOrderValue = orders.length > 0 ? revenue / orders.length : 0

  const hourlyTotals: Record<number, number> = {}
  for (const order of orders) {
    const hour = new Date(order.createdAt).getHours()
    const orderTotal = order.items.reduce(
      (s, item) => s + Number(item.priceEach) * item.quantity,
      0
    )
    hourlyTotals[hour] = (hourlyTotals[hour] || 0) + orderTotal
  }

  const currentHour = new Date().getHours()
  let cumulative = 0
  const revenueByHour = Array.from({ length: currentHour + 1 }, (_, h) => {
    cumulative += hourlyTotals[h] || 0
    return { hour: `${h}:00`, revenue: cumulative }
  })

  const itemCounts: Record<string, number> = {}
  for (const order of orders) {
    for (const item of order.items) {
      itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.quantity
    }
  }

  const topItemIds = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id)

  const topMenuItemsRaw = await prisma.menuItem.findMany({
    where: { id: { in: topItemIds } },
  })

  const topItems = topItemIds.map((id) => {
    const m = topMenuItemsRaw.find((mi) => mi.id === id)
    return { name: m?.name ?? 'Unknown', quantity: itemCounts[id] }
  })

  const business = await prisma.business.findUnique({ where: { slug: 'flame-fusion' } })

  const allItems = business
    ? await prisma.menuItem.findMany({ where: { businessId: business.id } })
    : []

  const lowStockItems = allItems.filter((item) => item.stock <= item.reorderLevel)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const menuUrl = `${siteUrl}/menu/flame-fusion`
  const qrDataUrl = await QRCode.toDataURL(menuUrl, {
    margin: 1,
    color: { dark: '#1E1E1E', light: '#FFFFFF' },
  })

  return (
    <OwnerLayout active="dashboard">
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-admin-ink/50">Today&apos;s revenue</p>
          <p className="mt-2 text-3xl font-semibold text-admin-ink">£{revenue.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-admin-ink/50">Orders today</p>
          <p className="mt-2 text-3xl font-semibold text-admin-ink">{orders.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-admin-ink/50">Avg order value</p>
          <p className="mt-2 text-3xl font-semibold text-admin-ink">£{avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6">
        <DashboardCharts revenueByHour={revenueByHour} topItems={topItems} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-admin-alert/20 bg-admin-alert/5 p-6">
          <h2 className="font-semibold text-admin-alert">Low stock alerts</h2>
          {lowStockItems.length === 0 ? (
            <p className="mt-3 text-sm text-admin-ink/50">All items are well stocked.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {lowStockItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm text-admin-ink">
                  <span>{item.name}</span>
                  <span className="font-medium text-admin-alert">{item.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-admin-ink">Menu QR code</h2>
          <div className="mt-4 inline-block rounded-lg border border-black/5 p-3">
            <img src={qrDataUrl} alt="QR code linking to your menu" width={140} height={140} />
          </div>
          <p className="mt-3 text-xs text-admin-ink/40">{menuUrl}</p>
        </div>
      </div>
    </OwnerLayout>
  )
}