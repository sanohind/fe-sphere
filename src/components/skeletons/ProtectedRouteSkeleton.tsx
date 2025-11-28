export default function ProtectedRouteSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-xl w-12 h-12" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Card Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-5 px-6 py-5 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:justify-between">
          <div className="w-full">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </div>
          <div className="flex items-start w-full gap-3 sm:justify-end">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6">
          <div className="overflow-hidden bg-white dark:bg-white/[0.03] rounded-xl">
            {/* Filter and Search */}
            <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
              </div>
              <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-64" />
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-gray-100 dark:border-white/[0.05]">
                    {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                      <th key={index} className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((rowIndex) => (
                    <tr key={rowIndex}>
                      {[1, 2, 3, 4, 5, 6, 7].map((colIndex) => (
                        <td key={colIndex} className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                <div className="pb-3 xl:pb-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-10" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
