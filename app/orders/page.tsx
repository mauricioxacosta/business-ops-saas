export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import OrderActions from './OrderActions'
import OwnerLayout from '../components/OwnerLayout'

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
    <OwnerLayout active="orders">
      <h2 className="font-semibold text-admin-ink">Orders</h2>

      {orders.length === 0 && (
        <p className="mt-4 text-sm text-admin-ink/50">No orders yet.</p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const total = order.items.reduce(
            (sum, item) => sum + Number(item.priceEach) * item.quantity,
            0
          )

          return (
            <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-admin-ink">
                  #{order.id.slice(-6)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    order.status === 'completed'
                      ? 'bg-admin-success/10 text-admin-success'
                      : 'bg-admin-accent/10 text-admin-accent'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="mt-1 text-xs text-admin-ink/40">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <ul className="mt-4 space-y-1">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-admin-ink/80">
                    <span>{item.quantity}x {item.menuItem.name}</span>
                    <span className="text-admin-ink/60">
                      £{(Number(item.priceEach) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
                <span className="text-sm font-semibold text-admin-ink">
                  £{total.toFixed(2)}
                </span>
                <OrderActions orderId={order.id} status={order.status} />
              </div>
            </div>
          )
        })}
      </div>
    </OwnerLayout>
  )
}