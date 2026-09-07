import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const { slug, items } = body

  if (!slug || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: 'Missing slug or items' },
      { status: 400 }
    )
  }

  const business = await prisma.business.findUnique({
    where: { slug },
  })

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          businessId: business.id,
          status: 'pending',
        },
      })

      for (const item of items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { id: item.menuItemId },
        })

        if (!menuItem || menuItem.businessId !== business.id) {
          throw new Error('Invalid menu item')
        }

        if (menuItem.stock < item.quantity) {
          throw new Error(`Not enough stock for ${menuItem.name}`)
        }

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            menuItemId: menuItem.id,
            quantity: item.quantity,
            priceEach: menuItem.price,
          },
        })

        await tx.menuItem.update({
          where: { id: menuItem.id },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}