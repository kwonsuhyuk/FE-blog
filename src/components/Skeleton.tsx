export function PostCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-transparent bg-bg-subtle/50 animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-20 h-3 bg-border-main rounded" />
        <div className="w-1 h-1 rounded-full bg-border-main" />
        <div className="w-12 h-3 bg-border-main rounded" />
      </div>
      <div className="w-2/3 h-7 bg-border-main rounded mb-2" />
      <div className="space-y-2">
        <div className="w-full h-4 bg-border-main/50 rounded" />
        <div className="w-5/6 h-4 bg-border-main/50 rounded" />
      </div>
    </div>
  );
}
