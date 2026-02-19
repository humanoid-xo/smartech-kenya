import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">SK</span>
        </div>
        <h1 className="text-8xl font-display font-bold text-primary-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">Page Not Found</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary px-8 py-3">Go Home</Link>
          <Link href="/products" className="btn-outline px-8 py-3">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
