import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const { menuItemId, ingredientId, quantity } = body

  if (!menuItemId || !ingredientId || typeof quantity !== 'number' || quantity <= 0) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
  }

  const recipeItem = await prisma.recipeItem.create({
    data: { menuItemId, ingredientId, quantity },
  })

  return NextResponse.json({ recipeItem }, { status: 201 })
}