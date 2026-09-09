export const dynamic = 'force-dynamic'
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
    <main className="min-h-screen bg-charcoal px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl text-cream">Orders</h1>

        {orders.length === 0 && (
          <p className="mt-6 text-cream/60">No orders yet.</p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {orders.map((order) => {
            const total = order.items.reduce(
              (sum, item) => sum + Number(item.priceEach) * item.quantity,
              0
            )

            return (
              <div
                key={order.id}
                className="rounded-lg border-t-2 border-dashed border-cream/20 bg-charcoal-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-cream/70">
                    #{order.id.slice(-6)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === 'completed'
                        ? 'bg-olive/20 text-olive'
                        : 'bg-valencia/20 text-valencia'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="mt-1 text-xs text-cream/40">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <ul className="mt-4 space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-cream/90">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span className="font-mono tabular-nums text-cream/70">
                        £{(Number(item.priceEach) * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-cream/10 pt-3">
                  <span className="font-mono text-sm font-medium text-cream">
                    £{total.toFixed(2)}
                  </span>
                  <OrderActions orderId={order.id} status={order.status} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}