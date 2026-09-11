export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import AddMenuItemForm from './AddMenuItemForm'
import MenuItemRow from './MenuItemRow'
import OwnerLayout from '../components/OwnerLayout'

const BUSINESS_SLUG = 'flame-fusion'

export default async function OwnerMenuPage() {
  const business = await prisma.business.findUnique({
    where: { slug: BUSINESS_SLUG },
    include: { menuItems: true },
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
              stock: item.stock,
              available: item.available,
            }}
          />
        ))}
      </ul>

      <h3 className="mt-8 text-sm font-medium text-admin-ink/50">Add new item</h3>
      <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
        <AddMenuItemForm slug={BUSINESS_SLUG} />
      </div>
    </OwnerLayout>
  )
}