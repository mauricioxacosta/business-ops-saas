export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import OwnerLayout from '../components/OwnerLayout'
import IngredientTable from '../components/IngredientTable'
import AddIngredientForm from '../components/AddIngredientForm'

const ORDERING_COST = 15
const HOLDING_COST_RATE = 0.2

export default async function InventoryPage() {
  const business = await prisma.business.findUnique({ where: { slug: 'flame-fusion' } })

  const ingredients = business
    ? await prisma.ingredient.findMany({ where: { businessId: business.id } })
    : []

  const completedOrders = business
    ? await prisma.order.findMany({
        where: { businessId: business.id, status: 'completed' },
        include: {
          items: {
            include: {
              menuItem: {
                include: { recipeItems: true },
              },
            },
          },
        },
      })
    : []

  const consumptionByIngredient: Record<string, number> = {}
  for (const order of completedOrders) {
    for (const orderItem of order.items) {
      for (const recipeItem of orderItem.menuItem.recipeItems) {
        consumptionByIngredient[recipeItem.ingredientId] =
          (consumptionByIngredient[recipeItem.ingredientId] || 0) +
          recipeItem.quantity * orderItem.quantity
      }
    }
  }

  const valueByIngredient: Record<string, number> = {}
  for (const ingredient of ingredients) {
    const consumed = consumptionByIngredient[ingredient.id] || 0
    const cost = ingredient.cost ? Number(ingredient.cost) : 1
    valueByIngredient[ingredient.id] = consumed * cost
  }

  const totalValue = Object.values(valueByIngredient).reduce((a, b) => a + b, 0)

  const ranked = [...ingredients].sort(
    (a, b) => (valueByIngredient[b.id] || 0) - (valueByIngredient[a.id] || 0)
  )

  let cumulative = 0
  const withCategory = ranked.map((ingredient) => {
    const value = valueByIngredient[ingredient.id] || 0
    cumulative += value
    const cumulativePct = totalValue > 0 ? (cumulative / totalValue) * 100 : 0

    let category: 'A' | 'B' | 'C' = 'C'
    if (cumulativePct <= 80) category = 'A'
    else if (cumulativePct <= 95) category = 'B'

    const demand = consumptionByIngredient[ingredient.id] || 0
    const cost = ingredient.cost ? Number(ingredient.cost) : 1
    const holdingCost = cost * HOLDING_COST_RATE
    const eoq =
      demand > 0 && holdingCost > 0
        ? Math.sqrt((2 * demand * ORDERING_COST) / holdingCost)
        : null

    return {
      id: ingredient.id,
      name: ingredient.name,
      unit: ingredient.unit,
      category,
      eoq: eoq ? Math.round(eoq) : null,
    }
  })

  return (
    <OwnerLayout active="inventory">
      <h2 className="font-semibold text-admin-ink">Inventory intelligence</h2>

      <p className="mt-1 max-w-2xl text-sm text-admin-ink/50">
        Ingredients are classified by consumption value (ABC analysis, based on completed
        orders) and given a recommended reorder quantity (EOQ), assuming a £{ORDERING_COST} cost
        per order placed and a {HOLDING_COST_RATE * 100}% annual holding cost. Ingredients
        without a cost entered use a nominal placeholder value — add real costs on new
        ingredients for more accurate recommendations. Recommendations improve as more orders
        are completed.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {(['A', 'B', 'C'] as const).map((cat) => {
          const label =
            cat === 'A' ? 'Tight control' : cat === 'B' ? 'Moderate control' : 'Basic control'
          const color =
            cat === 'A'
              ? 'bg-admin-alert/10 text-admin-alert'
              : cat === 'B'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-admin-success/10 text-admin-success'
          const catIngredients = withCategory.filter((i) => i.category === cat)

          return (
            <div key={cat} className="rounded-2xl bg-white p-5 shadow-sm">
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
                Category {cat} — {label}
              </span>
              <ul className="mt-3 space-y-2">
                {catIngredients.length === 0 ? (
                  <p className="text-sm text-admin-ink/40">No ingredients yet.</p>
                ) : (
                  catIngredients.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className="flex items-center justify-between text-sm text-admin-ink"
                    >
                      <span>{ingredient.name}</span>
                      {ingredient.eoq !== null && (
                        <span className="text-admin-ink/50">
                          Order {ingredient.eoq} {ingredient.unit}
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

      <h2 className="mt-10 font-semibold text-admin-ink">Ingredient stock</h2>
      <IngredientTable
        ingredients={ingredients.map((i) => ({
          id: i.id,
          name: i.name,
          unit: i.unit,
          stock: i.stock,
          reorderLevel: i.reorderLevel,
        }))}
      />

      <h2 className="mt-10 font-semibold text-admin-ink">Add new ingredient</h2>
      <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
        <AddIngredientForm slug="flame-fusion" />
      </div>
    </OwnerLayout>
  )
}