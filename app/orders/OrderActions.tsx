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
    <button onClick={markCompleted} disabled={loading}>
      {loading ? 'Updating...' : 'Mark as completed'}
    </button>
  )
}