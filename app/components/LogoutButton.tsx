'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/owner-logout', { method: 'POST' })
    router.push('/owner-login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-cream/50 hover:text-cream/80"
    >
      Log out
    </button>
  )
}