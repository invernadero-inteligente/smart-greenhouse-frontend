export default function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm animate-pulse">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-zinc-200" />

          {/* Text */}
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-zinc-200" />
            <div className="h-3 w-16 rounded bg-zinc-100" />
          </div>
        </div>

        {/* Switch */}
        <div className="w-14 h-8 rounded-full bg-zinc-200" />
      </div>

      {/* Middle */}
      <div className="mt-6 flex items-center justify-between">
        <div className="h-5 w-20 rounded-full bg-zinc-200" />
        <div className="h-4 w-12 rounded bg-zinc-100" />
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-200" />
          <div className="h-3 w-24 rounded bg-zinc-200" />
        </div>

        <div className="h-3 w-16 rounded bg-zinc-100" />
      </div>
    </div>
  );
}