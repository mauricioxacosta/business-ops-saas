import { prisma } from '@/lib/prisma'
import AddMenuItemForm from './AddMenuItemForm'

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
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom: '1px solid #ddd',
            }}
          >
            <span>{item.name} — £{item.price.toString()}</span>
            <span>Stock: {item.stock}</span>
          </li>
        ))}
      </ul>

      <h2>Add New Item</h2>
      <AddMenuItemForm slug={BUSINESS_SLUG} />
    </main>
  )
}