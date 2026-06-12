export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-2 border-gray-100"/>
          <div className="absolute inset-0 border-2 border-t-blue-700 animate-spin"/>
        </div>
        <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
