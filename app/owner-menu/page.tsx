export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import AddMenuItemForm from './AddMenuItemForm'
import MenuItemRow from './MenuItemRow'
import OwnerLayout from '../components/OwnerLayout'
import RecipeManager from '../components/RecipeManager'

const BUSINESS_SLUG = 'flame-fusion'

export default async function OwnerMenuPage() {
  const business = await prisma.business.findUnique({
    where: { slug: BUSINESS_SLUG },
    include: {
      menuItems: {
        include: {
          recipeItems: {
            include: { ingredient: true },
          },
        },
      },
      ingredients: true,
    },
  })

  if (!business) {
    return <p className="p-8 text-admin-ink">Business not found.</p>
  }

  return (
    <OwnerLayout active="menu">
      <h2 className="font-semibold text-admin-ink">Menu — {business.name}</h2>

      <h3 className="mt-8 text-sm font-medium text-admin-ink/50">Current items</h3>
      <ul className="mt-3 divide-y divide-black/5 rounded-2xl bg-white px-5 shadow-sm">
        {business.menuItems.map((item) => (
          <MenuItemRow
            key={item.id}
            item={{
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price.toString(),
              available: item.available,
            }}
          />
        ))}
      </ul>

      <h3 className="mt-8 text-sm font-medium text-admin-ink/50">Add new item</h3>
      <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
        <AddMenuItemForm slug={BUSINESS_SLUG} />
      </div>

      <h3 className="mt-10 text-sm font-medium text-admin-ink/50">Recipes</h3>
      <p className="mt-1 max-w-2xl text-sm text-admin-ink/40">
        Assign which ingredients (and how much of each) each menu item uses. Ingredients are
        deducted from stock only once an order is marked completed.
      </p>
      <div className="mt-3 space-y-4">
        {business.menuItems.map((item) => (
          <RecipeManager
            key={item.id}
            menuItemId={item.id}
            menuItemName={item.name}
            recipeItems={item.recipeItems.map((ri) => ({
              id: ri.id,
              ingredientId: ri.ingredientId,
              ingredientName: ri.ingredient.name,
              unit: ri.ingredient.unit,
              quantity: ri.quantity,
            }))}
            ingredients={business.ingredients.map((ing) => ({
              id: ing.id,
              name: ing.name,
              unit: ing.unit,
            }))}
          />
        ))}
      </div>
    </OwnerLayout>
  )
}