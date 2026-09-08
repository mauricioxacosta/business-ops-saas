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

  const inputClass =
    'w-full rounded-md border border-cream/15 bg-charcoal px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-valencia focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
      />
      <div className="flex gap-3">
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-md bg-valencia py-2.5 text-sm font-medium text-cream transition hover:bg-valencia/90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Adding…' : 'Add item'}
      </button>
      {message && <p className="text-sm text-valencia">{message}</p>}
    </form>
  )
}