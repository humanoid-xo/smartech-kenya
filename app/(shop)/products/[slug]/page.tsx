import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/features/products/ProductDetail';

async function getProduct(slug: string) {
  // Extract ID from slug (format: product-name-1234567890)
  const id = slug.split('-').pop();
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;
  
  const data = await res.json();
  return data.data;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductDetail product={product} />
        </Suspense>
      </div>
    </div>
  );
}
