export default function UserProfileSkeleton() {
  return (
    <>
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
      </div>

      {/* Main Card Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          {/* UserMetaCard Skeleton */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/5" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
              </div>
            </div>
          </div>

          {/* UserInfoCard Skeleton */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
                </div>
              ))}
            </div>
          </div>

          {/* UserAddressCard Skeleton */}
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/5" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
