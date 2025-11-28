export default function MainMenuSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Profile Card Skeleton */}
      <div className="col-span-12 xl:col-span-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="space-y-4">
            {/* Avatar Skeleton */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
            {/* Name Skeleton */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            {/* Title Skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto" />
            {/* Email Skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5 mx-auto" />
            {/* Status Skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3 mx-auto" />
            {/* Button Skeleton */}
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Applications Section Skeleton */}
      <div className="col-span-12 xl:col-span-8">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
        </div>

        {/* Menu Cards Grid Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
