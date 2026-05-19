import { DashboardSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header skeleton */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-3 w-64 bg-gray-100 rounded-lg animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-xl animate-pulse" />
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      <DashboardSkeleton />
    </div>
  );
}
