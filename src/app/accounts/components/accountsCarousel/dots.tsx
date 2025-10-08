import { cn } from "@/lib/utils"

interface DotsProps {
  amount: number
  current: number
  onClick: (index: number) => void
  shouldShowTotalSummaryCard?: boolean
}

const Dots = ({ amount, current, onClick, shouldShowTotalSummaryCard }: DotsProps) => {
  return (
    <div className="flex justify-center gap-2 mt-3">
      {shouldShowTotalSummaryCard && (
        <div
          key="total"
          onClick={() => onClick(0)}
          className={cn("w-2 h-2 rounded-full backdrop-blur-xl bg-gray-950/10", current === 0 && "bg-gray-950/40")}
        />
      )}
      {Array.from({ length: amount }).map((_, index) => {
        const carouselIndex = shouldShowTotalSummaryCard ? index + 1 : index
        return (
          <div
            key={index}
            onClick={() => onClick(carouselIndex)}
            className={cn("w-2 h-2 rounded-full backdrop-blur-xl bg-gray-950/10", current === carouselIndex && "bg-gray-950/40")}
          />
        )
      })}
    </div>
  )
}

export default Dots
