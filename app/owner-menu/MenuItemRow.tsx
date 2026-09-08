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

  const inputClass =
    'w-full rounded-md border border-cream/15 bg-charcoal px-3 py-1.5 text-sm text-cream focus:border-valencia focus:outline-none'

  if (editing) {
    return (
      <li className="py-4">
        <div className="flex flex-col gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputClass}
          />
          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            Available
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-md bg-olive px-3 py-1.5 text-xs font-medium text-cream hover:bg-olive/90"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-md border border-cream/20 px-3 py-1.5 text-xs font-medium text-cream/70 hover:bg-cream/5"
            >
              Cancel
            </button>
          </div>
          {message && <p className="text-xs text-valencia">{message}</p>}
        </div>
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm text-cream">
          {item.name}{' '}
          <span className="font-mono text-cream/60">£{Number(item.price).toFixed(2)}</span>
        </p>
        <p className="mt-0.5 text-xs text-cream/40">Stock: {item.stock}</p>
        {!item.available && (
          <p className="mt-0.5 text-xs text-valencia">Unavailable</p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setEditing(true)}
          className="rounded-md border border-cream/20 px-3 py-1.5 text-xs font-medium text-cream/70 hover:bg-cream/5"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="rounded-md border border-valencia/40 px-3 py-1.5 text-xs font-medium text-valencia hover:bg-valencia/10"
        >
          Delete
        </button>
      </div>
      {message && <p className="text-xs text-valencia">{message}</p>}
    </li>
  )
}