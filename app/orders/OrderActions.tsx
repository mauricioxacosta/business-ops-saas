'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OrderActions({
  orderId,
  status,
}: {
  orderId: string
  status: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function markCompleted() {
    setLoading(true)
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })
    setLoading(false)
    router.refresh()
  }

  if (status === 'completed') {
    return null
  }

  return (
    <button
      onClick={markCompleted}
      disabled={loading}
      className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-admin-accent/90 disabled:opacity-50"
    >
      {loading ? 'Updating…' : 'Mark completed'}
    </button>
  )
}