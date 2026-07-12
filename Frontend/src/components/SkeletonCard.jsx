export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border h-full flex flex-col">
      <div className="aspect-[16/10] skeleton-box w-full" />
      <div className="p-6 flex-grow space-y-5">
        <div className="flex gap-2 mb-4">
          <div className="h-4 w-16 skeleton-box rounded-lg" />
          <div className="h-4 w-24 skeleton-box rounded-lg" />
        </div>
        <div className="space-y-3">
          <div className="h-7 w-full skeleton-box rounded-xl" />
          <div className="h-7 w-4/5 skeleton-box rounded-xl" />
        </div>
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full skeleton-box rounded-lg" />
          <div className="h-4 w-full skeleton-box rounded-lg" />
          <div className="h-4 w-2/3 skeleton-box rounded-lg" />
        </div>
      </div>
      <div className="p-6 border-t border-gray-100 dark:border-dark-border flex justify-between items-center">
        <div className="h-5 w-24 skeleton-box rounded-lg" />
        <div className="flex gap-3">
          <div className="h-10 w-10 skeleton-box rounded-xl" />
          <div className="h-10 w-10 skeleton-box rounded-xl" />
        </div>
      </div>
    </div>
  );
}
