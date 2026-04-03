/**
 * Admin Product Creation API
 * POST /api/admin/products
 * Body: { secret, name, brand, sku?, category, price, comparePrice?, stock?, description?, subcategory?, imageBase64? }
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function autoSku(name: string, brand: string): string {
  // e.g. "MIKA 8kg Washing Machine" + "Mika" → "MIKA-8KG-WASHING-MACHI-1234"
  const words = name.toUpperCase().replace(/[^A-Z0-9\s]/g, '').split(/\s+/).slice(0, 4);
  const suffix = Date.now().toString().slice(-4);
  return [brand.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4), ...words].join('-').slice(0, 24) + '-' + suffix;
}

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
    const body = await req.json();
    const { secret, name, brand, category, price, comparePrice, stock, description, subcategory, imageBase64 } = body;
    let { sku } = body;

    /* ── Auth ── */
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    /* ── Validate required fields ── */
    if (!name || !brand || !category || price === undefined) {
      return NextResponse.json({ error: 'name, brand, category and price are required' }, { status: 400 });
    }
    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
      return NextResponse.json({ error: 'price must be a positive number' }, { status: 400 });
    }

    /* ── Auto-generate SKU if not provided ── */
    if (!sku || !sku.trim()) {
      sku = autoSku(name, brand);
    }

    /* ── Check SKU uniqueness ── */
    const existing = await prisma.product.findFirst({
      where: { sku: { equals: sku.trim(), mode: 'insensitive' } },
    });
    if (existing) {
      // Append timestamp to make it unique instead of erroring
      sku = sku.trim() + '-' + Date.now().toString().slice(-6);
    }

    /* ── Optionally upload image to Cloudinary ── */
    let images: string[] = [];
    if (imageBase64) {
      try {
        const url = await uploadToCloudinary(imageBase64, sku.trim());
        images = [url];
      } catch (imgErr: any) {
        console.warn('Image upload failed during product creation:', imgErr?.message);
        // Don't block product creation — image can be uploaded separately
      }
    }

    /* ── Find an admin user to use as seller (required by schema) ── */
    const adminUser = await prisma.user.findFirst({ where: { isAdmin: true } });
    if (!adminUser) {
      return NextResponse.json({
        error: 'No admin user found in database. Please seed an admin account first.',
      }, { status: 500 });
    }

    /* ── Create product ── */
    const productSlug = `${slugify(name)}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name:         name.trim(),
        brand:        brand.trim(),
        sku:          sku.trim().toUpperCase(),
        slug:         productSlug,
        category:     category as any,
        subcategory:  subcategory?.trim() || null,
        price:        parseFloat(String(price)),
        comparePrice: comparePrice ? parseFloat(String(comparePrice)) : null,
        stock:        stock ? parseInt(String(stock)) : 1,
        description:  description?.trim() || null,
        images,
        isActive:     true,
        isFeatured:   false,
        sellerId:     adminUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        sku:      product.sku,
        name:     product.name,
        brand:    product.brand,
        category: product.category,
        images:   product.images,
      },
      imageUploaded: images.length > 0,
    }, { status: 201 });

  } catch (err: any) {
    console.error('Admin create product error:', err);
    return NextResponse.json({ error: err?.message ?? 'Failed to create product' }, { status: 500 });
  }
}
