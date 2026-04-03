import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generateSku(name: string, brand: string): string {
  const brandPart = brand.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const namePart  = name.toUpperCase().replace(/[^A-Z0-9\s]/g, '')
                        .split(/\s+/).filter(Boolean).slice(0, 3).join('-');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${brandPart}-${namePart}-${rand}`.slice(0, 32);
}

async function uploadToCloudinary(b64: string, publicId: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey    = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const safeId    = publicId.replace(/[^a-zA-Z0-9_-]/g, '_');

  const ts  = Math.floor(Date.now() / 1000);
  const str = `overwrite=true&public_id=smartech-products/${safeId}&timestamp=${ts}${apiSecret}`;
  const raw = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  const sig = Array.from(new Uint8Array(raw)).map(b => b.toString(16).padStart(2,'0')).join('');

  const form = new URLSearchParams();
  form.set('file',      b64);
  form.set('public_id', `smartech-products/${safeId}`);
  form.set('overwrite', 'true');
  form.set('api_key',   apiKey);
  form.set('timestamp', String(ts));
  form.set('signature', sig);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(`Cloudinary error: ${res.status}`);
  const data = await res.json();
  return data.secure_url as string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, name, brand, category, price, comparePrice,
            stock, description, subcategory, imageBase64 } = body;
    let { sku } = body;

    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!name || !brand || !category || price === undefined) {
      return NextResponse.json({ error: 'name, brand, category and price are required' }, { status: 400 });
    }
    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
      return NextResponse.json({ error: 'price must be a positive number' }, { status: 400 });
    }

    // Auto-generate SKU if blank
    if (!sku || !sku.trim()) {
      sku = generateSku(name, brand);
    } else {
      sku = sku.trim().toUpperCase();
    }

    // Ensure SKU uniqueness
    const existing = await prisma.product.findFirst({
      where: { sku: { equals: sku, mode: 'insensitive' } },
    });
    if (existing) {
      sku = sku + '-' + Date.now().toString().slice(-5);
    }

    // Upload image if provided
    let images: string[] = [];
    if (imageBase64) {
      try {
        const url = await uploadToCloudinary(imageBase64, sku);
        images = [url];
      } catch (imgErr: any) {
        console.warn('Image upload failed:', imgErr?.message);
        // Continue without image — can be added later
      }
    }

    const adminUser = await prisma.user.findFirst({ where: { isAdmin: true } });
    if (!adminUser) {
      return NextResponse.json({
        error: 'No admin user found. Please seed an admin account first.',
      }, { status: 500 });
    }

    const slug    = `${slugify(name)}-${Date.now()}`;
    const product = await prisma.product.create({
      data: {
        name:         name.trim(),
        brand:        brand.trim(),
        sku,
        slug,
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
      success:       true,
      imageUploaded: images.length > 0,
      product: {
        id:       product.id,
        sku:      product.sku,
        slug:     product.slug,
        name:     product.name,
        brand:    product.brand,
        category: product.category,
        images:   product.images,
      },
    }, { status: 201 });

  } catch (err: any) {
    console.error('Admin create product error:', err);
    return NextResponse.json({ error: err?.message ?? 'Failed to create product' }, { status: 500 });
  }
}
