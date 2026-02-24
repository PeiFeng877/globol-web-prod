/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: None
 * OUTPUT: Loading skeleton for Date Ideas list
 * POS: App Router Loading UI
 * CONTRACT: Renders an instant loading state while the server component fetches data.
 * 职责: 文章列表页加载骨架屏，解决点击跳转时的视觉卡顿。
 */

export default function Loading() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header Skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 mb-6">
        <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
        <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="relative h-[400px] rounded-[28px] overflow-hidden bg-gray-100 ring-1 ring-black/5"
            >
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4">
                <div className="h-8 w-3/4 bg-gray-300 rounded-lg animate-pulse" />
                <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
