import { prisma } from '@/lib/prisma'
import OrderActions from './OrderActions'

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
  })

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => {
        const total = order.items.reduce(
          (sum, item) => sum + Number(item.priceEach) * item.quantity,
          0
        )

        return (
          <div
            key={order.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Order #{order.id.slice(-6)}</strong>
              <span>{order.status}</span>
            </div>

            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity}x {item.menuItem.name} — £
                  {(Number(item.priceEach) * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>

            <p>
              <strong>Total: £{total.toFixed(2)}</strong>
            </p>
            <OrderActions orderId={order.id} status={order.status} />
          </div>
        )
      })}
    </main>
  )
}