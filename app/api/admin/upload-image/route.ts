/**
 * Admin Image Upload API  (SKU-linked)
 * POST /api/admin/upload-image  → { secret, sku, imageBase64 }
 * GET  /api/admin/upload-image  → product list (requires MongoDB)
 *
 * Strategy: upload to Cloudinary first (always fast), then try to
 * update MongoDB. If Mongo times out the image is still on Cloudinary.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

async function sha1(str: string) {
  const raw = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(raw)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function uploadToCloudinary(b64: string, sku: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey    = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const safeId    = sku.replace(/[^a-zA-Z0-9_-]/g, '_');
  const folder    = `smartech-products/${safeId}`;
  const ts        = Math.floor(Date.now() / 1000);
  const sig       = await sha1(`overwrite=true&public_id=${folder}&timestamp=${ts}${apiSecret}`);

  const form = new URLSearchParams({
    file: b64, public_id: folder, overwrite: 'true',
    api_key: apiKey, timestamp: String(ts), signature: sig,
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST', body: form,
  });
  if (!res.ok) throw new Error(`Cloudinary error: ${res.status}`);
  return (await res.json()).secure_url as string;
}

export async function POST(req: NextRequest) {
  try {
    const { secret, sku, imageBase64 } = await req.json();
    if (!secret || secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!sku || !imageBase64)
      return NextResponse.json({ error: 'sku and imageBase64 are required' }, { status: 400 });

    /* 1. Cloudinary first — no DB dependency */
    const imageUrl = await uploadToCloudinary(imageBase64, sku.trim());

    /* 2. MongoDB update — best-effort, non-fatal */
    let dbUpdated = false;
    let productName: string | undefined;
    try {
      const product = await prisma.product.findFirst({
        where: { sku: { equals: sku.trim(), mode: 'insensitive' } },
      });
      if (product) {
        const kept    = (product.images ?? []).filter(img => !img.includes('unsplash.com') && img !== imageUrl);
        await prisma.product.update({ where: { id: product.id }, data: { images: [imageUrl, ...kept] } });
        dbUpdated   = true;
        productName = product.name;
      }
    } catch (dbErr: any) {
      console.warn('DB update skipped (timeout?):', dbErr?.message);
    }

    return NextResponse.json({
      success: true, imageUrl, dbUpdated,
      product: productName ? { sku: sku.trim(), name: productName } : null,
      note:    dbUpdated ? undefined : 'Uploaded to Cloudinary — DB update failed. Copy URL manually.',
    });
  } catch (err: any) {
    console.error('Admin upload error:', err);
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const products = await prisma.product.findMany({
      select:  { sku: true, name: true, images: true, brand: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ products });
  } catch (err: any) {
    console.warn('DB fetch failed, returning empty list:', err?.message);
    return NextResponse.json({
      products: [],
      dbError:  'Could not reach database — image upload still works via Direct Upload tab.',
    });
  }
}
