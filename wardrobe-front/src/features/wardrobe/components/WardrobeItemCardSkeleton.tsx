import { Skeleton } from '@/components/ui/Skeleton';

export function WardrobeItemCardSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 pb-3">
      <div className="aspect-[4/5] relative overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="px-3 pt-3 pb-2">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
