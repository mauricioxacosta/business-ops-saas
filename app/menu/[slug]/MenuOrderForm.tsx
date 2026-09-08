'use client'

import { useState } from 'react'

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  available: boolean
}

export default function MenuOrderForm({
  slug,
  menuItems,
}: {
  slug: string
  menuItems: MenuItem[]
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function updateQuantity(id: string, value: number) {
    setQuantities((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSubmit() {
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([menuItemId, quantity]) => ({ menuItemId, quantity }))

    if (items.length === 0) {
      setMessage('Select at least one item.')
      setStatus('error')
      return
    }

    setStatus('submitting')

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, items }),
    })

    const data = await res.json()

    if (res.ok) {
      setStatus('success')
      setMessage(`Order placed — order #${data.orderId.slice(-6)}`)
      setQuantities({})
    } else {
      setStatus('error')
      setMessage(data.error || 'Something went wrong.')
    }
  }

  return (
    <div>
      <ul className="divide-y divide-line">
        {menuItems.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4 py-5">
            <div className="min-w-0">
              <p className="font-medium text-ink">{item.name}</p>
              {item.description && (
                <p className="mt-1 text-sm text-ink/60">{item.description}</p>
              )}
              {!item.available && (
                <p className="mt-1 text-sm text-valencia">Currently unavailable</p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono text-sm tabular-nums text-ink/80">
                £{item.price.toFixed(2)}
              </span>
              <input
                type="number"
                min={0}
                max={item.stock}
                disabled={!item.available}
                value={quantities[item.id] || 0}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="w-14 rounded-md border border-line bg-paper px-2 py-1 text-center font-mono text-sm text-ink focus:border-valencia focus:outline-none disabled:opacity-40"
              />
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        disabled={status === 'submitting'}
        className="mt-6 w-full rounded-md bg-valencia py-3 font-medium text-cream transition hover:bg-valencia/90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Placing order…' : 'Place order'}
      </button>

      {message && (
        <p className={`mt-4 text-sm ${status === 'success' ? 'text-olive' : 'text-valencia'}`}>
          {message}
        </p>
      )}
    </div>
  )
}