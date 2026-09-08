import { prisma } from '@/lib/prisma'

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

  const topItems = topItemIds.map((id) => {
    const menuItem = topMenuItems.find((m) => m.id === id)
    return {
      name: menuItem?.name ?? 'Unknown',
      quantity: itemCounts[id],
    }
  })

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', flex: 1 }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Today&apos;s Revenue</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>£{revenue.toFixed(2)}</p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', flex: 1 }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Orders Today</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{orders.length}</p>
        </div>
      </div>

      <h2>Top Items Today</h2>
      {topItems.length === 0 && <p>No orders yet today.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {topItems.map((item) => (
          <li key={item.name} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
            {item.name} — {item.quantity} sold
          </li>
        ))}
      </ul>
    </main>
  )
}