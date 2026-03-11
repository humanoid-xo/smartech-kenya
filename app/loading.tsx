export default function Loading() {
  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-3 border-navy-200" />
          <div className="absolute inset-0 rounded-full border-3 border-t-primary-600 animate-spin" />
        </div>
        <p className="text-navy-400 font-body text-sm font-medium">Loading…</p>
      </div>
    </div>
  )
}
