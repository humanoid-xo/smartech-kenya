import { notFound }       from 'next/navigation';
import { prisma }           from '@/lib/db/prisma';
import { ProductDetail }    from '@/components/features/products/ProductDetail';
import { STATIC_PRODUCTS }  from '@/constants/staticProducts';

async function getProduct(slug: string) {
  // Extract the last segment of the slug as the ID
  const lastPart = slug.split('-').pop();
  if (!lastPart) return null;

  // 1. Try DB lookup (lastPart is the MongoDB ObjectId for real products)
  try {
    const product = await prisma.product.findUnique({
      where: { id: lastPart },
      include: {
        seller:  { select: { id: true, name: true, email: true } },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (product) {
      return {
        ...product,
        avgRating:   product.reviews.length > 0 ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0,
        reviewCount: product.reviews.length,
      };
    }
  } catch (_err) {
    // DB error — fall through to static lookup
  }

  // 2. Static product fallback: match by full slug OR by id like "static-N"
  const staticMatch =
    STATIC_PRODUCTS.find(p => p.slug === slug) ||
    STATIC_PRODUCTS.find(p => p.id === `static-${lastPart}`);

  if (staticMatch) {
    return {
      ...staticMatch,
      seller:  null,
      reviews: [],
    } as any;
  }

  return null;
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10">
      <div className="max-w-7xl mx-auto px-6">
        <ProductDetail product={product as any} />
      </div>
    </div>
  );
}
