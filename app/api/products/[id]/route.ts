import { NextRequest, NextResponse } from 'next/server';
import { prisma }                     from '@/lib/db/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        seller:  { select: { id: true, name: true, email: true } },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

    return NextResponse.json({
      success: true,
      data:    { ...product, avgRating, reviewCount: product.reviews.length },
    });
  } catch (err) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}
