import * as React from "react"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import AccountCard from "../../../../components/accountCard/accountCard"
import AccountCardSkeleton from "../../../../components/accountCard/accountCardSkeleton"
import { useAccounts } from "@/services/accounts/queries"
import { useCurrentAccount } from "@/contexts/currentAccountContext"
import Dots from "./dots"

const AccountsCarousel = () => {
  const { data: accounts, isLoading, isError } = useAccounts()
  const { setCurrentAccountId } = useCurrentAccount()
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

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

  if (isLoading && !accounts) {
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

  if (isError || !accounts) {
    // TODO: Add error state
    return <div>Error loading accounts</div>
  }

  return (
    <div className="">
      <div className="w-screen flex justify-center -mx-4.5 overflow-hidden">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
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
