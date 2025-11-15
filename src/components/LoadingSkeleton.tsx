import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 rounded w-3/4" />
              <Skeleton className="h-4 rounded w-1/2" />
              <Skeleton className="h-4 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
