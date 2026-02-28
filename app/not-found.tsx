import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="font-display text-[8rem] text-gray-100 leading-none select-none mb-4">404</div>
        <h2 className="font-display text-2xl text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-500 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
