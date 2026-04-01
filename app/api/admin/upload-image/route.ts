/**
 * Admin Image Upload API
 * POST /api/admin/upload-image
 * Body: { secret, sku, imageBase64 }
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

async function uploadToCloudinary(b64: string, sku: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey    = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const safeId    = sku.replace(/[^a-zA-Z0-9_-]/g, '_');

  const ts  = Math.floor(Date.now() / 1000);
  const str = `overwrite=true&public_id=smartech-products/${safeId}&timestamp=${ts}${apiSecret}`;
  const raw = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  const sig  = Array.from(new Uint8Array(raw)).map(b => b.toString(16).padStart(2,'0')).join('');

  const form = new URLSearchParams();
  form.set('file',       b64);
  form.set('public_id',  `smartech-products/${safeId}`);
  form.set('overwrite',  'true');
  form.set('api_key',    apiKey);
  form.set('timestamp',  String(ts));
  form.set('signature',  sig);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form }
  );
  if (!res.ok) throw new Error(`Cloudinary error: ${res.status}`);
  const data = await res.json();
  return data.secure_url as string;
}

export async function POST(req: NextRequest) {
  try {
    const { secret, sku, imageBase64 } = await req.json();

    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!sku || !imageBase64) {
      return NextResponse.json({ error: 'sku and imageBase64 are required' }, { status: 400 });
    }

    const product = await prisma.product.findFirst({
      where: { sku: { equals: sku.trim(), mode: 'insensitive' } },
    });
    if (!product) {
      return NextResponse.json({ error: `Product with SKU "${sku}" not found` }, { status: 404 });
    }

    const imageUrl = await uploadToCloudinary(imageBase64, sku.trim());
    const kept     = (product.images ?? []).filter(img => !img.includes('unsplash.com'));
    const updated  = [imageUrl, ...kept];

    await prisma.product.update({
      where: { id: product.id },
      data:  { images: updated },
    });

    return NextResponse.json({
      success:  true,
      imageUrl,
      product:  { id: product.id, name: product.name, sku: product.sku },
    });
  } catch (err: any) {
    console.error('Admin upload error:', err);
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const products = await prisma.product.findMany({
    select: { sku: true, name: true, images: true, brand: true, category: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ products });
}
