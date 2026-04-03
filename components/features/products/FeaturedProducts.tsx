import { prisma }      from '@/lib/db/prisma';
import { ProductCard } from './ProductCard';

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where:    { isActive: true, isFeatured: true },
      take:     8,
      orderBy:  { createdAt: 'desc' },
      include: {
        seller:  { select: { id: true, name: true } },
        reviews: { select: { rating: true }         },
      },
    });

    return products.map((p) => ({
      ...p,
      avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
  } catch (err) {
    console.error('FeaturedProducts fetch error:', err);
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No featured products yet — check back soon.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
