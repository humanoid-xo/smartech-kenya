import { notFound }          from 'next/navigation';
import { getProductBySlug }  from '@/lib/cloudinary';
import { ProductDetail }     from '@/components/features/products/ProductDetail';

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10">
      <div className="max-w-7xl mx-auto px-6">
        <ProductDetail product={product as any} />
      </div>
    </div>
  );
}
