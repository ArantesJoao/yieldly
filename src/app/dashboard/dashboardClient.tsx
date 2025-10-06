'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTranslation } from "react-i18next"

import { Title } from "@/components/ui/title"
import { Skeleton } from "@/components/ui/skeleton"
import { DebugPanel } from "./components/debugPanel"
import YieldsTable from "@/components/data/yieldsTable"
import BalanceGraph from "@/components/data/balanceGraph"
import AccountsCarousel from "../accounts/components/accountsCarousel"
import { useAccounts } from "@/services/accounts/queries"

export default function DashboardClient() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const { data: accounts } = useAccounts()
  const { t } = useTranslation('dashboard')
  const user = session?.user
  const hasAccounts = accounts && accounts.length > 0

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    }
  }, [sessionStatus, router])

  const firstName = user?.name?.split(' ').slice(0, -1).join(' ') || user?.name?.split(' ')[0]

  return (
    <>
      <div className="flex flex-col gap-4 w-full pb-12">
        {sessionStatus === 'loading' ? (
          <Title className="flex items-center gap-2">{t('greeting', { name: '' })} <Skeleton className="h-10 w-48" /></Title>
        ) : (
          <Title>{t('greeting', { name: firstName })}</Title>
        )}
        <AccountsCarousel />
        {hasAccounts && (
          <>
            <YieldsTable />
            <BalanceGraph />
          </>
        )}
      </div>
      <DebugPanel />
    </>
  )
}
