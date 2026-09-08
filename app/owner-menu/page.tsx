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
    return <p>Business not found.</p>
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Manage Menu — {business.name}</h1>

      <h2>Current Items</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
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

      <h2>Add New Item</h2>
      <AddMenuItemForm slug={BUSINESS_SLUG} />
    </main>
  )
}