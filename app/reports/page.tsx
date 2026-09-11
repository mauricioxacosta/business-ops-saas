export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import OwnerLayout from '../components/OwnerLayout'
import ReportsCharts from '../components/ReportsCharts'

function formatDateInput(date: Date) {
  return date.toISOString().split('T')[0]
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>
}) {
  const params = await searchParams

  const defaultEnd = new Date()
  const defaultStart = new Date()
  defaultStart.setDate(defaultStart.getDate() - 6)

  const startDate = params.start ? new Date(params.start) : defaultStart
  const endDate = params.end ? new Date(params.end) : defaultEnd
  endDate.setHours(23, 59, 59, 999)
  startDate.setHours(0, 0, 0, 0)

  const business = await prisma.business.findUnique({ where: { slug: 'flame-fusion' } })

  const orders = business
    ? await prisma.order.findMany({
        where: {
          businessId: business.id,
          createdAt: { gte: startDate, lte: endDate },
        },
        include: { items: { include: { menuItem: true } } },
        orderBy: { createdAt: 'asc' },
      })
    : []

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((s, item) => s + Number(item.priceEach) * item.quantity, 0),
    0
  )
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

  const dailyTotals: Record<string, number> = {}
  for (const order of orders) {
    const day = new Date(order.createdAt).toISOString().split('T')[0]
    const orderTotal = order.items.reduce(
      (s, item) => s + Number(item.priceEach) * item.quantity,
      0
    )
    dailyTotals[day] = (dailyTotals[day] || 0) + orderTotal
  }
  const revenueByDay = Object.entries(dailyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, revenue]) => ({ day: day.slice(5), revenue }))

  const itemCounts: Record<string, { name: string; quantity: number }> = {}
  for (const order of orders) {
    for (const item of order.items) {
      if (!itemCounts[item.menuItemId]) {
        itemCounts[item.menuItemId] = { name: item.menuItem.name, quantity: 0 }
      }
      itemCounts[item.menuItemId].quantity += item.quantity
    }
  }
  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6)

  return (
    <OwnerLayout active="reports">
      <h2 className="font-semibold text-admin-ink">Reports</h2>

      <form method="GET" className="mt-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-admin-ink/50">From</label>
          <input
            type="date"
            name="start"
            defaultValue={formatDateInput(startDate)}
            className="mt-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm text-admin-ink focus:border-admin-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-admin-ink/50">To</label>
          <input
            type="date"
            name="end"
            defaultValue={formatDateInput(endDate)}
            className="mt-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm text-admin-ink focus:border-admin-accent focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-admin-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-admin-accent/90"
        >
          Update
        </button>
      </form>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-admin-ink/50">Total revenue</p>
          <p className="mt-2 text-3xl font-semibold text-admin-ink">£{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-admin-ink/50">Total orders</p>
          <p className="mt-2 text-3xl font-semibold text-admin-ink">{orders.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-admin-ink/50">Avg order value</p>
          <p className="mt-2 text-3xl font-semibold text-admin-ink">£{avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6">
        <ReportsCharts revenueByDay={revenueByDay} topItems={topItems} />
      </div>
    </OwnerLayout>
  )
}