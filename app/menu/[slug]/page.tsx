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
    description: item.description,
    price: item.price.toNumber(),
    stock: item.stock,
    available: item.available,
  }))

  return (
    <main className="min-h-screen bg-paper px-6 py-12">
      <div className="mx-auto max-w-lg">
        <header className="mb-10 text-center">
          <p className="font-mono text-xs text-ink/50">Valencia, Spain</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">{business.name}</h1>
        </header>

        <MenuOrderForm slug={slug} menuItems={menuItems} />
      </div>
    </main>
  )
}