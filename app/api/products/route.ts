import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
const createProductSchema = z.object({ name: z.string().min(1), description: z.string().min(10), price: z.number().positive(), category: z.enum(['tech','kitchen']), brand: z.string().min(1), stock: z.number().int().min(0), images: z.array(z.string().url()).min(1), features: z.record(z.any()).optional() });
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const where: any = {};
    const category = searchParams.get('category'); if (category) where.category = category;
    const brand = searchParams.get('brand'); if (brand) where.brand = brand;
    const search = searchParams.get('search'); if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    const minPrice = searchParams.get('minPrice'); const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) { where.price = {}; if (minPrice) where.price.gte = parseFloat(minPrice); if (maxPrice) where.price.lte = parseFloat(maxPrice); }
    const page = parseInt(searchParams.get('page') || '1'); const limit = parseInt(searchParams.get('limit') || '12');
    const [products, total] = await Promise.all([prisma.product.findMany({ where, include: { seller: { select: { id: true, name: true } }, reviews: true }, skip: (page-1)*limit, take: limit, orderBy: { createdAt: 'desc' } }), prisma.product.count({ where })]);
    const productsWithRatings = products.map(p => ({ ...p, avgRating: p.reviews.length > 0 ? p.reviews.reduce((sum: number, r) => sum + r.rating, 0) / p.reviews.length : 0, reviewCount: p.reviews.length }));
    return NextResponse.json({ products: productsWithRatings, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).isSeller) return NextResponse.json({ error: 'Unauthorized - Seller access required' }, { status: 401 });
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);
    const product = await prisma.product.create({ data: { ...validatedData, sellerId: (session.user as any).id } });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
