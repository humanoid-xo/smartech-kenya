import { notFound }      from 'next/navigation';
import { prisma }         from '@/lib/db/prisma';
import { ProductDetail }  from '@/components/features/products/ProductDetail';
import { STATIC_PRODUCTS } from '@/constants/staticProducts';

async function getProduct(slug: string) {
  const lastPart = slug.split('-').pop();
  if (!lastPart) return null;

  // 1. Try database by id (last slug segment)
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
        avgRating:   product.reviews.length > 0
          ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0,
        reviewCount: product.reviews.length,
      };
    }
  } catch {
    // fall through
  }

  // 2. Try database by slug
  try {
    const product = await prisma.product.findFirst({
      where: { slug },
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
      };
    }
  } catch {
    // fall through
  }

  // 3. Static product fallback (by full slug or by id like "static-N")
  const staticMatch =
    STATIC_PRODUCTS.find(p => p.slug === slug) ||
    STATIC_PRODUCTS.find(p => p.id === `static-${lastPart}`) ||
    STATIC_PRODUCTS.find(p => slug.endsWith(p.id));

  if (staticMatch) {
    return { ...staticMatch, seller: null, reviews: [] } as any;
  }

  return null;
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 mt-[68px]">
      <div className="max-w-7xl mx-auto px-6">
        <ProductDetail product={product as any} />
      </div>
    </div>
  );
}
