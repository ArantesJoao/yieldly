import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Wallet } from "lucide-react"
import router from "next/router"
import { Button } from "react-day-picker"
import { useTranslation } from "react-i18next"

const CarouselEmptyState = () => {
  const { t } = useTranslation('dashboard')

  return (
    <Empty className="border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Wallet className="size-6" />
        </EmptyMedia>
        <EmptyTitle>{t('accountsCarousel.empty.title')}</EmptyTitle>
        <EmptyDescription>
          {t('accountsCarousel.empty.description')}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => router.push('/accounts')}>
          {t('accountsCarousel.empty.button')}
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default CarouselEmptyState
