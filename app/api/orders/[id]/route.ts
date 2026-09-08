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
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ order })
  } catch (err) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
}