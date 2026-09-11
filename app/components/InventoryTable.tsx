'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Item = {
  id: string
  name: string
  stock: number
  reorderLevel: number
}

export default function InventoryTable({ items }: { items: Item[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [addAmounts, setAddAmounts] = useState<Record<string, string>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAddStock(item: Item) {
    const amount = parseInt(addAmounts[item.id] || '0', 10)
    if (!amount || amount <= 0) return

    setLoadingId(item.id)
    await fetch(`/api/menu-items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: item.stock + amount }),
    })
    setAddAmounts((prev) => ({ ...prev, [item.id]: '' }))
    setLoadingId(null)
    router.refresh()
  }

  return (
    <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-black/10 px-3 py-2 text-sm text-admin-ink placeholder:text-admin-ink/30 focus:border-admin-accent focus:outline-none"
      />

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b border-black/5 text-left text-admin-ink/50">
            <th className="pb-2 font-medium">Item</th>
            <th className="pb-2 font-medium">Current stock</th>
            <th className="pb-2 font-medium">Reorder level</th>
            <th className="pb-2 font-medium">Add stock</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className="border-b border-black/5">
              <td className="py-3 text-admin-ink">{item.name}</td>
              <td className="py-3 text-admin-ink">
                {item.stock}
                {item.stock <= item.reorderLevel && (
                  <span className="ml-2 rounded-full bg-admin-alert/10 px-2 py-0.5 text-xs text-admin-alert">
                    Low
                  </span>
                )}
              </td>
              <td className="py-3 text-admin-ink/60">{item.reorderLevel}</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    value={addAmounts[item.id] || ''}
                    onChange={(e) =>
                      setAddAmounts((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    className="w-20 rounded-md border border-black/10 px-2 py-1 text-admin-ink focus:border-admin-accent focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddStock(item)}
                    disabled={loadingId === item.id}
                    className="rounded-md bg-admin-accent px-3 py-1 text-xs font-medium text-white hover:bg-admin-accent/90 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}