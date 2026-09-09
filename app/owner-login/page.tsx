'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OwnerLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/owner-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-charcoal-card p-8"
      >
        <h1 className="font-serif text-2xl text-cream">Owner login</h1>
        <p className="mt-2 text-sm text-cream/50">Flame Fusion</p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full rounded-md border border-cream/15 bg-charcoal px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-valencia focus:outline-none"
          required
          autoFocus
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-md bg-valencia py-2.5 text-sm font-medium text-cream transition hover:bg-valencia/90 disabled:opacity-50"
        >
          {loading ? 'Checking…' : 'Log in'}
        </button>

        {error && <p className="mt-3 text-sm text-valencia">{error}</p>}
      </form>
    </main>
  )
}