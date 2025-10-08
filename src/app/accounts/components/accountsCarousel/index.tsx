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

  // Set the current account ID when accounts load or carousel changes
  React.useEffect(() => {
    if (accounts && accounts.length > 0) {
      setCurrentAccountId(accounts[current]?.id || null)
    }
  }, [accounts, current, setCurrentAccountId])

  if (isAccountsLoading && !accounts) {
    return (
      <div className="">
        <div className="w-screen flex justify-center -mx-4.5 overflow-hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {[1, 2, 3].map((index) => (
                <CarouselItem key={index}>
                  <AccountCardSkeleton className="h-72" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <Dots
          current={0}
          onClick={() => { }}
          amount={3}
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

  const totalSummaryCard = transformTotalSummaryToAcocuntCard(totalSummary)
  console.log("accounts.length === 1 && !!totalSummaryCard", accounts.length === 1 && !!totalSummaryCard)
  return (
    <div className="">
      <div className="w-screen flex justify-center -mx-4.5 overflow-hidden">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {accounts.length > 1 && !!totalSummaryCard && (
              <CarouselItem>
                <AccountCard {...totalSummaryCard} />
              </CarouselItem>
            )}
            {accounts.map((account, index) => (
              <CarouselItem key={index} className="">
                <AccountCard account={account} className="h-72" showActions />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

      </div>
      <Dots
        current={current}
        onClick={(index) => api?.scrollTo(index)}
        amount={accounts.length}
      />
    </div>

  )
}

export default AccountsCarousel
