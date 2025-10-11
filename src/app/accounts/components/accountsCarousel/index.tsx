import * as React from "react"

import { useAccounts } from "@/services/accounts/queries"
import { useCurrentAccount } from "@/contexts/currentAccountContext"

import Dots from "./dots"
import CarouselEmptyState from "./carouselEmptyState"
import AccountCard from "../../../../components/accountCard/accountCard"
import AccountCardSkeleton from "../../../../components/accountCard/accountCardSkeleton"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useTotalSummary } from "@/services/summary/queries"
import { transformTotalSummaryToAcocuntCard } from "@/utils/transforms"

const AccountsCarousel = () => {
  const [current, setCurrent] = React.useState(0)
  const { setCurrentAccountId } = useCurrentAccount()
  const [api, setApi] = React.useState<CarouselApi>()

  const {
    data:
    accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useAccounts()

  const {
    data: totalSummary,
    isLoading: isTotalSummaryLoading,
    isError: isTotalSummaryError,
  } = useTotalSummary(undefined, undefined, true)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api, current, setCurrent])

  const totalSummaryCard = React.useMemo(() => transformTotalSummaryToAcocuntCard(totalSummary), [totalSummary])
  const shouldShowTotalSummaryCard = React.useMemo(
    () => accounts && accounts.length > 1 && !!totalSummaryCard && !isTotalSummaryLoading && !isTotalSummaryError,
    [accounts, totalSummaryCard, isTotalSummaryLoading, isTotalSummaryError]
  )

  // Set the current account ID when accounts load or carousel changes
  React.useEffect(() => {
    if (accounts && accounts.length > 0) {
      if (shouldShowTotalSummaryCard && current === 0) {
        setCurrentAccountId("total")
      } else {
        const accountIndex = shouldShowTotalSummaryCard ? current - 1 : current
        setCurrentAccountId(accounts[accountIndex]?.id || null)
      }
    }
  }, [accounts, current, setCurrentAccountId, shouldShowTotalSummaryCard])

  if (isAccountsLoading && !accounts) {
    return (
      <div className="w-full max-w-3xl md:mx-0">
        <div className="relative">
          <Carousel className="w-full" setApi={setApi}>
            <div className="flex justify-center md:mx-0 overflow-hidden">
              <CarouselContent>
                {[1, 2, 3].map((index) => (
                  <CarouselItem key={index} className="md:py-2">
                    <AccountCardSkeleton className="h-72" />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
        <Dots
          current={current}
          amount={3}
          onClick={(index) => api?.scrollTo(index)}
          shouldShowTotalSummaryCard={shouldShowTotalSummaryCard}
        />
      </div>
    )
  }

  if (isAccountsError || !accounts) {
    // TODO: Add error state
    return <div>Error loading accounts</div>
  }

  if (accounts.length === 0) {
    return <CarouselEmptyState />
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="relative">
        <Carousel className="w-full" setApi={setApi}>
          <div className="flex justify-center md:mx-0 overflow-hidden">
            <CarouselContent>
              {shouldShowTotalSummaryCard && totalSummaryCard && (
                <CarouselItem className="md:py-2">
                  <AccountCard {...totalSummaryCard} accountCount={accounts.length} />
                </CarouselItem>
              )}
              {accounts.map((account, index) => (
                <CarouselItem key={index} className="md:py-2">
                  <AccountCard account={account} className="h-72" showActions />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
      <Dots
        current={current}
        amount={accounts.length}
        onClick={(index) => api?.scrollTo(index)}
        shouldShowTotalSummaryCard={shouldShowTotalSummaryCard}
      />
    </div>

  )
}

export default AccountsCarousel
