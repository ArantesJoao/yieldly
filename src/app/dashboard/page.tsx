'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div>
      <header>
        <h1>Yieldly Dashboard</h1>
        <div>
          <span>Welcome, {session.user.name || session.user.email}</span>
          <button onClick={() => signOut({ callbackUrl: '/login' })}>
            Sign Out
          </button>
        </div>
      </header>

      <main>
        <div>
          <h2>Dashboard Coming Soon</h2>
          <p>Your investment tracking dashboard will be implemented here.</p>
          <p>Role: {session.user.role}</p>
        </div>
      </main>
    </div>
  )
}
