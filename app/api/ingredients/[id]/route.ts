import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const {
    name,
    unit,
    stock,
    reorderLevel,
    cost,
  } = body

  if (
    stock !== undefined &&
    (typeof stock !== 'number' || stock < 0)
  ) {
    return NextResponse.json(
      { error: 'Stock must be a non-negative number' },
      { status: 400 }
    )
  }

  try {
    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(unit !== undefined && { unit }),
        ...(stock !== undefined && { stock }),
        ...(reorderLevel !== undefined && { reorderLevel }),
        ...(cost !== undefined && { cost }),
      },
    })

    return NextResponse.json({ ingredient })
  } catch (err) {
    return NextResponse.json(
      { error: 'Ingredient not found' },
      { status: 404 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await prisma.ingredient.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          'Cannot delete an ingredient that is used in a recipe. Remove it from recipes first.',
      },
      { status: 400 }
    )
  }
}