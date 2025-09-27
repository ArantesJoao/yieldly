'use client'

import { Title } from "@/components/ui/title"
import Controls from "./components/controls"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const user = session?.user
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || !user) {
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
    <div className="flex flex-col gap-4">
      <Title>Olá, {user.name?.split(' ').slice(0, -1).join(' ') || user.name?.split(' ')[0]}</Title>
      <Controls />
    </div >
  )
}
