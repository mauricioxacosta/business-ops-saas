import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { quantity } = body

  if (typeof quantity !== 'number' || quantity <= 0) {
    return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 })
  }

  try {
    const recipeItem = await prisma.recipeItem.update({
      where: { id },
      data: { quantity },
    })
    return NextResponse.json({ recipeItem })
  } catch (err) {
    return NextResponse.json({ error: 'Recipe item not found' }, { status: 404 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await prisma.recipeItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Recipe item not found' }, { status: 404 })
  }
}