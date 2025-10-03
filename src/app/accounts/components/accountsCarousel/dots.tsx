import { cn } from "@/lib/utils"

interface DotsProps {
  amount: number
  current: number
  onClick: (index: number) => void
}

const Dots = ({ amount, current, onClick }: DotsProps) => {

  console.log(amount, current)
  return (
    <div className="flex justify-center gap-2 mt-3">
      {Array.from({ length: amount }).map((_, index) => (
        <div
          key={index}
          onClick={() => onClick(index)}
          className={cn("w-2 h-2 rounded-full backdrop-blur-xl bg-gray-950/10", current === index && "bg-gray-950/40")}
        />
      ))}
    </div>
  )
}

export default Dots
