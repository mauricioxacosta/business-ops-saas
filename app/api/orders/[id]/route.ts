import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!status || !['pending', 'completed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    const existingOrder = await prisma.order.findUnique({ where: { id } })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const isNewlyCompleted = status === 'completed' && existingOrder.status !== 'completed'

    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
      })

      if (isNewlyCompleted) {
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: id },
          include: {
            menuItem: {
              include: { recipeItems: true },
            },
          },
        })

        for (const orderItem of orderItems) {
          for (const recipeItem of orderItem.menuItem.recipeItems) {
            await tx.ingredient.update({
              where: { id: recipeItem.ingredientId },
              data: {
                stock: { decrement: recipeItem.quantity * orderItem.quantity },
              },
            })
          }
        }
      }

      return updatedOrder
    })

    return NextResponse.json({ order })
  } catch (err) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
}