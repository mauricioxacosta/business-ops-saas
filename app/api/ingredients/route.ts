import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()

  const {
    slug,
    name,
    unit,
    stock,
    reorderLevel,
    cost,
  } = body

  if (!slug || !name) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  if (
    stock !== undefined &&
    (typeof stock !== 'number' || stock < 0)
  ) {
    return NextResponse.json(
      { error: 'Stock must be a non-negative number' },
      { status: 400 }
    )
  }

  const business = await prisma.business.findUnique({
    where: { slug },
  })

  if (!business) {
    return NextResponse.json(
      { error: 'Business not found' },
      { status: 404 }
    )
  }

  const ingredient = await prisma.ingredient.create({
    data: {
      businessId: business.id,
      name,
      unit: unit || 'units',
      stock: stock ?? 0,
      reorderLevel: reorderLevel ?? 5,
      cost: cost !== undefined ? cost : null,
    },
  })

  return NextResponse.json(
    { ingredient },
    { status: 201 }
  )
}