import { Skeleton } from "@/components/ui/skeleton";

const BalanceGraphSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Chart skeleton */}
      <Skeleton className="h-[300px] w-full rounded-lg" />

      {/* Legend skeleton */}
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export default BalanceGraphSkeleton;

