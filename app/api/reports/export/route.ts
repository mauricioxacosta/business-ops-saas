import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const startParam = searchParams.get('start')
  const endParam = searchParams.get('end')

  const business = await prisma.business.findUnique({
    where: {
      slug: 'flame-fusion',
    },
  })

  if (!business) {
    return NextResponse.json(
      { error: 'Business not found' },
      { status: 404 }
    )
  }

  const defaultEnd = new Date()
  const defaultStart = new Date()

  defaultStart.setDate(defaultStart.getDate() - 6)

  const startDate = startParam ? new Date(startParam) : defaultStart
  const endDate = endParam ? new Date(endParam) : defaultEnd

  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)

  const orders = await prisma.order.findMany({
    where: {
      businessId: business.id,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const rows = [
    ['Order ID', 'Date', 'Status', 'Items', 'Total (£)'],
  ]

  for (const order of orders) {
    const itemsSummary = order.items
      .map(
        (item) =>
          `${item.quantity}x ${item.menuItem.name}`
      )
      .join('; ')

    const total = order.items.reduce(
      (sum, item) =>
        sum + Number(item.priceEach) * item.quantity,
      0
    )

    rows.push([
      order.id.slice(-6),
      new Date(order.createdAt).toLocaleString(),
      order.status,
      itemsSummary,
      total.toFixed(2),
    ])
  }

  const csv = rows
    .map((row) =>
      row
        .map(
          (field) =>
            `"${String(field).replace(/"/g, '""')}"`
        )
        .join(',')
    )
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="orders-${startParam || 'range'}-to-${endParam || 'range'}.csv"`,
    },
  })
}