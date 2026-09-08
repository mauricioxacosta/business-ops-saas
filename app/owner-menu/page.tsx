import { prisma } from '@/lib/prisma'
import AddMenuItemForm from './AddMenuItemForm'
import MenuItemRow from './MenuItemRow'

const BUSINESS_SLUG = 'flame-fusion'

export default async function OwnerMenuPage() {
  const business = await prisma.business.findUnique({
    where: { slug: BUSINESS_SLUG },
    include: { menuItems: true },
  })

  if (!business) {
    return <p className="p-8 text-cream">Business not found.</p>
  }

  return (
    <main className="min-h-screen bg-charcoal px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl text-cream">Manage menu — {business.name}</h1>

        <h2 className="mt-10 text-sm font-medium text-cream/50">Current items</h2>
        <ul className="mt-3 divide-y divide-cream/10 rounded-lg bg-charcoal-card px-5">
          {business.menuItems.map((item) => (
            <MenuItemRow
              key={item.id}
              item={{
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price.toString(),
                stock: item.stock,
                available: item.available,
              }}
            />
          ))}
        </ul>

        <h2 className="mt-10 text-sm font-medium text-cream/50">Add new item</h2>
        <div className="mt-3 rounded-lg bg-charcoal-card p-5">
          <AddMenuItemForm slug={BUSINESS_SLUG} />
        </div>
      </div>
    </main>
  )
}