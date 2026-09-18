import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isRateLimited } from '@/lib/rateLimit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 }
    )
  }

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
        if (
          typeof item.quantity !== 'number' ||
          item.quantity <= 0 ||
          !Number.isInteger(item.quantity)
        ) {
          throw new Error('Invalid quantity')
        }

        const menuItem = await tx.menuItem.findUnique({
          where: { id: item.menuItemId },
        })

        if (!menuItem || menuItem.businessId !== business.id) {
          throw new Error('Invalid menu item')
        }

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            menuItemId: menuItem.id,
            quantity: item.quantity,
            priceEach: menuItem.price,
          },
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