import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const { slug, name, description, price } = body

  if (!slug || !name || price === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  if (typeof price !== 'number' || price <= 0) {
    return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
  }

  const business = await prisma.business.findUnique({ where: { slug } })

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  const menuItem = await prisma.menuItem.create({
    data: {
      businessId: business.id,
      name,
      description: description || null,
      price,
    },
  })

  return NextResponse.json({ menuItem }, { status: 201 })
}