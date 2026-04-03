import { notFound }    from 'next/navigation';
import { prisma }      from '@/lib/db/prisma';
import { ProductDetail } from '@/components/features/products/ProductDetail';
import { STATIC_PRODUCTS } from '@/constants/staticProducts';

export const revalidate = 60;

async function getProduct(slug: string) {
  /* ── 1. Try DB (last segment as Prisma ID) ── */
  const lastSeg = slug.split('-').pop();
  if (lastSeg) {
    try {
      const p = await prisma.product.findUnique({
        where: { id: lastSeg },
        include: {
          seller:  { select: { id: true, name: true, email: true } },
          reviews: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      if (p) return {
        ...p,
        avgRating:   p.reviews.length > 0 ? p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length : 0,
        reviewCount: p.reviews.length,
      };
    } catch { /* fall through */ }
  }

  /* ── 2. Try static products — match "static-N" anywhere in slug ── */
  const m = slug.match(/static-\d+/);
  if (m) {
    const sp = STATIC_PRODUCTS.find(p => p.id === m[0]);
    if (sp) return {
      ...sp,
      slug,
      stock:        (sp as any).stock        ?? 10,
      isFeatured:   (sp as any).isFeatured   ?? false,
      comparePrice: sp.comparePrice          ?? null,
      subcategory:  sp.subcategory           ?? null,
      sellerId:     null,
      seller:       null,
      reviews:      [],
      avgRating:    0,
      reviewCount:  0,
      createdAt:    new Date(),
      updatedAt:    new Date(),
    };
  }

  /* ── 3. Last resort: search static products by name slug ── */
  const byName = STATIC_PRODUCTS.find(p => {
    const nameSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return slug.startsWith(nameSlug.substring(0, 20));
  });
  if (byName) return {
    ...byName,
    slug,
    stock:        10,
    isFeatured:   false,
    comparePrice: byName.comparePrice ?? null,
    subcategory:  byName.subcategory  ?? null,
    sellerId:     null,
    seller:       null,
    reviews:      [],
    avgRating:    0,
    reviewCount:  0,
    createdAt:    new Date(),
    updatedAt:    new Date(),
  };

  return null;
}

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
