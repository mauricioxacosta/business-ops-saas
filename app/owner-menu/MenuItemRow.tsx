'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  stock: number
  available: boolean
}

export default function MenuItemRow({ item }: { item: MenuItem }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const [price, setPrice] = useState(item.price)
  const [stock, setStock] = useState(String(item.stock))
  const [available, setAvailable] = useState(item.available)
  const [message, setMessage] = useState('')

  async function handleSave() {
    const res = await fetch(`/api/menu-items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        available,
      }),
    })

    if (res.ok) {
      setEditing(false)
      router.refresh()
    } else {
      setMessage('Failed to save changes.')
    }
  }

  async function handleDelete() {
    const confirmed = confirm(`Delete "${item.name}"? This cannot be undone.`)
    if (!confirmed) return

    const res = await fetch(`/api/menu-items/${item.id}`, {
      method: 'DELETE',
    })

    const data = await res.json()

    if (res.ok) {
      router.refresh()
    } else {
      setMessage(data.error || 'Failed to delete item.')
    }
  }

  if (editing) {
    return (
      <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            {' '}Available
          </label>
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
          {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
      </li>
    )
  }

  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid #ddd',
      }}
    >
      <span>
        {item.name} — £{Number(item.price).toFixed(2)} (Stock: {item.stock})
        {!item.available && ' — Unavailable'}
      </span>
      <div>
        <button onClick={() => setEditing(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </li>
  )
}