import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { ProductDetail } from '@/components/features/products/ProductDetail';

async function getProduct(slug: string) {
  const id = slug.split('-').pop();
  if (!id) return null;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      avgRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
    };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export const revalidate = 60;

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
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
