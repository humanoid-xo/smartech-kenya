import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
const updateProductSchema = z.object({ name: z.string().min(1).optional(), description: z.string().optional(), price: z.number().positive().optional(), category: z.string().optional(), brand: z.string().optional(), stock: z.number().int().min(0).optional(), images: z.array(z.string()).optional(), features: z.record(z.any()).optional() });
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id }, include: { seller: { select: { id: true, name: true, email: true } }, reviews: { include: { user: { select: { name: true } } } } } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    const avgRating = product.reviews.length > 0 ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length : 0;
    return NextResponse.json({ ...product, avgRating, reviewCount: product.reviews.length });
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 }); }
}
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (product.sellerId !== (session.user as any).id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);
    const updatedProduct = await prisma.product.update({ where: { id: params.id }, data: validatedData });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    if (product.sellerId !== (session.user as any).id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 }); }
}
