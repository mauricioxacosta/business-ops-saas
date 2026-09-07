'use client'

import { useState } from 'react'

type MenuItem = {
  id: string
  name: string
  price: number
  stock: number
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
      setMessage(`Order placed! Order ID: ${data.orderId}`)
      setQuantities({})
    } else {
      setStatus('error')
      setMessage(data.error || 'Something went wrong.')
    }
  }

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid #ddd',
            }}
          >
            <span>{item.name} — £{item.price.toFixed(2)}</span>
            <input
              type="number"
              min={0}
              max={item.stock}
              value={quantities[item.id] || 0}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              style={{ width: '60px' }}
            />
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Placing order...' : 'Place order'}
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}