import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { name, description, price, stock, available } = body

  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
    return NextResponse.json({ error: 'Stock must be a non-negative whole number' }, { status: 400 })
  }

  try {
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(available !== undefined && { available }),
      },
    })

    return NextResponse.json({ menuItem })
  } catch (err) {
    return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await prisma.menuItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Cannot delete an item that already has orders. Mark it unavailable instead.' },
      { status: 400 }
    )
  }
}