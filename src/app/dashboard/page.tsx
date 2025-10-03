'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { Title } from "@/components/ui/title"
import AccountsCarousel from "../accounts/components/accountsCarousel"
import { DebugPanel } from "./components/debugPanel"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user

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
    <>
      <div className="flex flex-col gap-4 w-full pb-20">
        <Title>Olá, {user.name?.split(' ').slice(0, -1).join(' ') || user.name?.split(' ')[0]}</Title>
        <AccountsCarousel />
      </div>
      <DebugPanel />
    </>
  )
}
