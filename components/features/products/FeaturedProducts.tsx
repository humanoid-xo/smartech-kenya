import { prisma } from '@/lib/db/prisma';
import { ProductCard } from './ProductCard';

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: { id: true, name: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    return products.map((product) => ({
      ...product,
      avgRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
    }));
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No featured products available yet.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
