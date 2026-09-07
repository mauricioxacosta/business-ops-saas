import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import MenuOrderForm from './MenuOrderForm'

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

  const menuItems = business.menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price.toNumber(),
    stock: item.stock,
  }))

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{business.name}</h1>
      <MenuOrderForm slug={slug} menuItems={menuItems} />
    </main>
  )
}