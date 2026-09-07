import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const business = await prisma.business.findUnique({
    where: { slug },
    include: { menuItems: true },
  })

  if (!business) {
    notFound()
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{business.name}</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {business.menuItems.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.75rem 0',
              borderBottom: '1px solid #ddd',
            }}
          >
            <span>{item.name}</span>
            <span>£{item.price.toString()}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}