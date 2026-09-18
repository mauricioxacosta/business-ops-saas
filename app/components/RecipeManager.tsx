'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type RecipeItemData = {
  id: string
  ingredientId: string
  ingredientName: string
  unit: string
  quantity: number
}

type IngredientOption = {
  id: string
  name: string
  unit: string
}

export default function RecipeManager({
  menuItemId,
  menuItemName,
  recipeItems,
  ingredients,
}: {
  menuItemId: string
  menuItemName: string
  recipeItems: RecipeItemData[]
  ingredients: IngredientOption[]
}) {
  const router = useRouter()
  const [selectedIngredientId, setSelectedIngredientId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [message, setMessage] = useState('')

  async function handleAdd() {
    if (!selectedIngredientId || !quantity || parseFloat(quantity) <= 0) {
      setMessage('Choose an ingredient and a positive quantity.')
      return
    }

    const res = await fetch('/api/recipe-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menuItemId,
        ingredientId: selectedIngredientId,
        quantity: parseFloat(quantity),
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setSelectedIngredientId('')
      setQuantity('')
      setMessage('')
      router.refresh()
    } else {
      setMessage(data.error || 'Failed to add ingredient.')
    }
  }

  async function handleRemove(recipeItemId: string) {
    await fetch(`/api/recipe-items/${recipeItemId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="font-medium text-admin-ink">{menuItemName}</p>

      {recipeItems.length === 0 ? (
        <p className="mt-2 text-sm text-admin-ink/40">No ingredients assigned yet.</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {recipeItems.map((ri) => (
            <li key={ri.id} className="flex items-center justify-between text-sm text-admin-ink/80">
              <span>
                {ri.quantity} {ri.unit} {ri.ingredientName}
              </span>
              <button
                onClick={() => handleRemove(ri.id)}
                className="text-xs text-admin-alert hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={selectedIngredientId}
          onChange={(e) => setSelectedIngredientId(e.target.value)}
          className="rounded-lg border border-black/10 bg-admin-bg px-3 py-1.5 text-sm text-admin-ink focus:border-admin-accent focus:outline-none"
        >
          <option value="">Select ingredient...</option>
          {ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.name} ({ing.unit})
            </option>
          ))}
        </select>
        <input
          type="number"
          step="any"
          min={0}
          placeholder="Qty per order"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-32 rounded-lg border border-black/10 bg-admin-bg px-3 py-1.5 text-sm text-admin-ink focus:border-admin-accent focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-admin-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-admin-accent/90"
        >
          Add
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-admin-alert">{message}</p>}
    </div>
  )
}