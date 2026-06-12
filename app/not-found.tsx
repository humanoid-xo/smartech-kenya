import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-[7rem] font-bold text-gray-100 leading-none mb-6 select-none tracking-tight">404</p>
        <p className="eyebrow mb-4">Page Not Found</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">This page doesn't exist</h1>
        <p className="text-gray-500 text-sm mb-10">The link may be broken or the page may have been removed.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary px-7 py-3">Back to Home</Link>
          <Link href="/products" className="btn-outline px-7 py-3">Shop Products</Link>
        </div>
      </div>
    </div>
  );
}
