import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const roundeds = {
  sm:   'rounded',
  md:   'rounded-md',
  lg:   'rounded-xl',
  xl:   'rounded-2xl',
  full: 'rounded-full',
};

export function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-border',
        roundeds[rounded],
        className
      )}
    />
  );
}

// Pre-composed skeletons for common patterns
export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden shadow-theme-sm">
      <Skeleton className="h-44 w-full" rounded="sm" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3 mt-1" />
        <Skeleton className="h-9 w-full mt-2" rounded="xl" />
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden shadow-theme-sm">
      <Skeleton className="h-40 w-full" rounded="sm" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}
