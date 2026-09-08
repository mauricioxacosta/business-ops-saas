'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddMenuItemForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')

    const res = await fetch('/api/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10) || 0,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setName('')
      setDescription('')
      setPrice('')
      setStock('')
      setStatus('idle')
      router.refresh()
    } else {
      setStatus('error')
      setMessage(data.error || 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Adding...' : 'Add item'}
      </button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  )
}