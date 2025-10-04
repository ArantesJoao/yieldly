'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { Title } from "@/components/ui/title"
import { Skeleton } from "@/components/ui/skeleton"
import AccountsCarousel from "../accounts/components/accountsCarousel"
import { DebugPanel } from "./components/debugPanel"
import YieldsTable from "@/components/data/yieldsTable"
import BalanceGraph from "@/components/data/balanceGraph"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const user = session?.user

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    }
  }, [sessionStatus, router])

  return (
    <>
      <div className="flex flex-col gap-4 w-full pb-20">
        {sessionStatus === 'loading' ? (
          <Title className="flex items-center gap-2">Olá, <Skeleton className="h-10 w-48" /></Title>
        ) : (
          <Title>Olá, {user?.name?.split(' ').slice(0, -1).join(' ') || user?.name?.split(' ')[0]}</Title>
        )}
        <AccountsCarousel />
        <YieldsTable />
        <BalanceGraph period="Last 30 days" />
      </div>
      <DebugPanel />
    </>
  )
}
