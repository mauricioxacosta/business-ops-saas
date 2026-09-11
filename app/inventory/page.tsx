export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import OwnerLayout from '../components/OwnerLayout'
import InventoryTable from '../components/InventoryTable'

const ORDERING_COST = 15
const HOLDING_COST_RATE = 0.2

export default async function InventoryPage() {
  const business = await prisma.business.findUnique({
    where: {
      slug: 'flame-fusion',
    },
  })

  const items = business
    ? await prisma.menuItem.findMany({
        where: {
          businessId: business.id,
        },
      })
    : []

  const orderItems = business
    ? await prisma.orderItem.findMany({
        where: {
          menuItem: {
            businessId: business.id,
          },
        },
        select: {
          menuItemId: true,
          quantity: true,
          priceEach: true,
        },
      })
    : []

  const revenueByItem: Record<string, number> = {}
  const quantityByItem: Record<string, number> = {}

  for (const oi of orderItems) {
    revenueByItem[oi.menuItemId] =
      (revenueByItem[oi.menuItemId] || 0) +
      Number(oi.priceEach) * oi.quantity

    quantityByItem[oi.menuItemId] =
      (quantityByItem[oi.menuItemId] || 0) + oi.quantity
  }

  const totalRevenue = Object.values(revenueByItem).reduce(
    (a, b) => a + b,
    0
  )

  const ranked = [...items].sort(
    (a, b) =>
      (revenueByItem[b.id] || 0) -
      (revenueByItem[a.id] || 0)
  )

  let cumulative = 0

  const withCategory = ranked.map((item) => {
    const itemRevenue = revenueByItem[item.id] || 0

    cumulative += itemRevenue

    const cumulativePct =
      totalRevenue > 0
        ? (cumulative / totalRevenue) * 100
        : 0

    let category: 'A' | 'B' | 'C' = 'C'

    if (cumulativePct <= 80) {
      category = 'A'
    } else if (cumulativePct <= 95) {
      category = 'B'
    }

    const demand = quantityByItem[item.id] || 0

    const cost = item.cost
      ? Number(item.cost)
      : Number(item.price) * 0.5

    const holdingCost = cost * HOLDING_COST_RATE

    const eoq =
      demand > 0 && holdingCost > 0
        ? Math.sqrt(
            (2 * demand * ORDERING_COST) / holdingCost
          )
        : null

    return {
      id: item.id,
      name: item.name,
      category,
      eoq: eoq ? Math.round(eoq) : null,
    }
  })

  return (
    <OwnerLayout active="inventory">
      <h2 className="font-semibold text-admin-ink">
        Inventory intelligence
      </h2>

      <p className="mt-1 max-w-2xl text-sm text-admin-ink/50">
        Items are classified by revenue contribution (ABC analysis)
        and given a recommended reorder quantity (EOQ), assuming a £
        {ORDERING_COST} cost per order placed and a{' '}
        {HOLDING_COST_RATE * 100}% annual holding cost.
        Recommendations improve as more order history builds up.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {(['A', 'B', 'C'] as const).map((cat) => {
          const label =
            cat === 'A'
              ? 'Tight control'
              : cat === 'B'
                ? 'Moderate control'
                : 'Basic control'

          const color =
            cat === 'A'
              ? 'bg-admin-alert/10 text-admin-alert'
              : cat === 'B'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-admin-success/10 text-admin-success'

          const catItems = withCategory.filter(
            (i) => i.category === cat
          )

          return (
            <div
              key={cat}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
              >
                Category {cat} — {label}
              </span>

              <ul className="mt-3 space-y-2">
                {catItems.length === 0 ? (
                  <p className="text-sm text-admin-ink/40">
                    No items yet.
                  </p>
                ) : (
                  catItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-sm text-admin-ink"
                    >
                      <span>{item.name}</span>

                      {item.eoq !== null && (
                        <span className="text-admin-ink/50">
                          Order {item.eoq}
                        </span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )
        })}
      </div>

      <h2 className="mt-10 font-semibold text-admin-ink">
        Stock management
      </h2>

      <InventoryTable
        items={items.map((item) => ({
          id: item.id,
          name: item.name,
          stock: item.stock,
          reorderLevel: item.reorderLevel,
        }))}
      />
    </OwnerLayout>
  )
}