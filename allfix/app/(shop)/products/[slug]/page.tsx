import { notFound }      from 'next/navigation';
import { prisma }         from '@/lib/db/prisma';
import { ProductDetail }  from '@/components/features/products/ProductDetail';
import { STATIC_PRODUCTS } from '@/constants/staticProducts';

/** Extract the product from the slug param.
 *
 *  Two URL formats exist:
 *  1. DB product:      /products/my-product-name-64abc123def (last segment is MongoDB ObjectId)
 *  2. Static product:  /products/mika-side-by-side-fridge-442l-inverter (entire slug is the id)
 */
async function getProduct(slugParam: string) {
  // ── 1. Try DB first ──────────────────────────────────────────────────────
  try {
    // For DB products the last hyphen-segment is the MongoDB ObjectId
    const lastSegment = slugParam.split('-').pop() ?? '';

    // MongoDB ObjectIds are 24-char hex — if it looks like one, try it
    if (/^[a-f0-9]{24}$/i.test(lastSegment)) {
      const product = await prisma.product.findUnique({
        where: { id: lastSegment },
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
          avgRating:   product.reviews.length > 0
            ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0,
          reviewCount: product.reviews.length,
          isStatic:    false,
        };
      }
    }

    // Also try a DB lookup by slug (in case the DB product slug matches)
    const bySlug = await prisma.product.findFirst({
      where: { slug: slugParam },
      include: {
        seller:  { select: { id: true, name: true, email: true } },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (bySlug) {
      return {
        ...bySlug,
        avgRating:   bySlug.reviews.length > 0
          ? bySlug.reviews.reduce((s, r) => s + r.rating, 0) / bySlug.reviews.length : 0,
        reviewCount: bySlug.reviews.length,
        isStatic:    false,
      };
    }
  } catch (err) {
    console.error('Product DB fetch error:', err);
  }

  // ── 2. Fall back to static catalogue ─────────────────────────────────────
  const staticProduct = STATIC_PRODUCTS.find(
    p => p.slug === slugParam || p.id === slugParam
  );

  if (staticProduct) {
    return {
      ...staticProduct,
      seller:      { id: 'static', name: 'Smartech Kenya', email: '' },
      reviews:     [] as any[],
      description: staticProduct.description ?? '',
      features:    null,
      specifications: null,
      isStatic:    true,
    };
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
