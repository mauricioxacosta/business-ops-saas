'use client'

import { useRouter } from 'next/navigation'

export default function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/owner-logout', { method: 'POST' })
    router.push('/owner-login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-admin-ink/50 hover:text-admin-ink"
    >
      Log out
    </button>
  )
}