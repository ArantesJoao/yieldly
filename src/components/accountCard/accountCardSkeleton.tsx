import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface AccountCardSkeletonProps {
  className?: string
}

const AccountCardSkeleton = ({ className }: AccountCardSkeletonProps) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-between relative w-full overflow-hidden rounded-2xl p-5 bg-muted",
        className
      )}
    >
      {/* Texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.00) 60%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 w-full">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Institution logo skeleton */}
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      </div>

      <div className="relative flex justify-between mt-4">
        <div className="flex flex-col gap-0.5">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-32" />
        </div>
        {/* Deposit button skeleton */}
        <Skeleton className="h-10 w-10 rounded-full self-end" />
      </div>
    </div>
  )
}

export default AccountCardSkeleton

