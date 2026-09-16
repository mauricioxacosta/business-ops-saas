'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddIngredientForm({ slug }: { slug: string }) {
  const router = useRouter()

  const [name, setName] = useState('')
  const [unit, setUnit] = useState('units')
  const [stock, setStock] = useState('')
  const [reorderLevel, setReorderLevel] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setStatus('submitting')

    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
        name,
        unit,
        stock: parseFloat(stock) || 0,
        reorderLevel: parseFloat(reorderLevel) || 5,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setName('')
      setUnit('units')
      setStock('')
      setReorderLevel('')
      setStatus('idle')

      router.refresh()
    } else {
      setStatus('error')
      setMessage(data.error || 'Something went wrong.')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-black/10 bg-admin-bg px-3 py-2 text-sm text-admin-ink placeholder:text-admin-ink/30 focus:border-admin-accent focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Ingredient name (e.g. Burger buns)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
        required
      />

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Unit (e.g. units, g, ml)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className={`${inputClass} min-w-[120px] flex-1`}
        />

        <input
          type="number"
          step="any"
          placeholder="Starting stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className={`${inputClass} min-w-[120px] flex-1`}
        />

        <input
          type="number"
          step="any"
          placeholder="Reorder level"
          value={reorderLevel}
          onChange={(e) => setReorderLevel(e.target.value)}
          className={`${inputClass} min-w-[120px] flex-1`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-lg bg-admin-accent py-2.5 text-sm font-medium text-white transition hover:bg-admin-accent/90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Adding…' : 'Add ingredient'}
      </button>

      {message && (
        <p className="text-sm text-admin-alert">
          {message}
        </p>
      )}
    </form>
  )
}