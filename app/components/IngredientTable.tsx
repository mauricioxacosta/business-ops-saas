'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Ingredient = {
  id: string
  name: string
  unit: string
  stock: number
  reorderLevel: number
}

export default function IngredientTable({
  ingredients,
}: {
  ingredients: Ingredient[]
}) {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [addAmounts, setAddAmounts] = useState<Record<string, string>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAddStock(ingredient: Ingredient) {
    const amount = parseFloat(addAmounts[ingredient.id] || '0')

    if (!amount || amount <= 0) return

    setLoadingId(ingredient.id)

    await fetch(`/api/ingredients/${ingredient.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock: ingredient.stock + amount,
      }),
    })

    setAddAmounts((prev) => ({
      ...prev,
      [ingredient.id]: '',
    }))

    setLoadingId(null)
    router.refresh()
  }

  async function handleDelete(ingredient: Ingredient) {
    const confirmed = confirm(
      `Delete "${ingredient.name}"? This cannot be undone.`
    )

    if (!confirmed) return

    const res = await fetch(`/api/ingredients/${ingredient.id}`, {
      method: 'DELETE',
    })

    const data = await res.json()

    if (res.ok) {
      router.refresh()
    } else {
      alert(data.error || 'Failed to delete ingredient.')
    }
  }

  return (
    <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
      <input
        type="text"
        placeholder="Search ingredients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-black/10 px-3 py-2 text-sm text-admin-ink placeholder:text-admin-ink/30 focus:border-admin-accent focus:outline-none"
      />

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-admin-ink/50">
              <th className="pb-2 font-medium">Ingredient</th>
              <th className="pb-2 font-medium">Current stock</th>
              <th className="pb-2 font-medium">Reorder level</th>
              <th className="pb-2 font-medium">Add stock</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((ingredient) => (
              <tr
                key={ingredient.id}
                className="border-b border-black/5"
              >
                <td className="py-3 text-admin-ink">
                  {ingredient.name}
                </td>

                <td className="py-3 text-admin-ink">
                  {ingredient.stock} {ingredient.unit}

                  {ingredient.stock <= ingredient.reorderLevel && (
                    <span className="ml-2 rounded-full bg-admin-alert/10 px-2 py-0.5 text-xs text-admin-alert">
                      Low
                    </span>
                  )}
                </td>

                <td className="py-3 text-admin-ink/60">
                  {ingredient.reorderLevel} {ingredient.unit}
                </td>

                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="Qty"
                      value={addAmounts[ingredient.id] || ''}
                      onChange={(e) =>
                        setAddAmounts((prev) => ({
                          ...prev,
                          [ingredient.id]: e.target.value,
                        }))
                      }
                      className="w-20 rounded-md border border-black/10 px-2 py-1 text-admin-ink focus:border-admin-accent focus:outline-none"
                    />

                    <button
                      onClick={() => handleAddStock(ingredient)}
                      disabled={loadingId === ingredient.id}
                      className="rounded-md bg-admin-accent px-3 py-1 text-xs font-medium text-white hover:bg-admin-accent/90 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </td>

                <td className="py-3">
                  <button
                    onClick={() => handleDelete(ingredient)}
                    className="rounded-md border border-admin-alert/30 px-2 py-1 text-xs font-medium text-admin-alert hover:bg-admin-alert/5"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}