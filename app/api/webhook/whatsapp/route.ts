/**
 * WhatsApp Image Webhook — Smartech Kenya
 * ─────────────────────────────────────────
 * Powered by Twilio WhatsApp API + Cloudinary
 *
 * HOW IT WORKS:
 *  1. Owner sends WhatsApp image to the Twilio sandbox number
 *  2. Caption = product SKU (e.g. MRNF2D442XLBV) or part of name
 *  3. Webhook downloads image, uploads to Cloudinary,
 *     updates the product in MongoDB, and replies with confirmation.
 *
 * Setup instructions are in /admin page.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

function twiml(msg: string): NextResponse {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${msg}</Message></Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  );
}

async function uploadToCloudinary(
  imageUrl: string,
  publicId: string,
  twSid:    string,
  twToken:  string,
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey    = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  // Download from Twilio (requires basic auth)
  const mediaRes = await fetch(imageUrl, {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${twSid}:${twToken}`).toString('base64'),
    },
  });
  if (!mediaRes.ok) throw new Error(`Media download failed: ${mediaRes.status}`);

  const buf    = Buffer.from(await mediaRes.arrayBuffer());
  const b64    = `data:image/jpeg;base64,${buf.toString('base64')}`;
  const safeId = publicId.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Build Cloudinary signature
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

  const up = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form }
  );
  if (!up.ok) throw new Error(`Cloudinary upload failed: ${up.status} ${await up.text()}`);
  const data = await up.json();
  return data.secure_url as string;
}

export async function POST(req: NextRequest) {
  try {
    const raw    = await req.text();
    const params = new URLSearchParams(raw);

    const from     = params.get('From')    ?? '';
    const caption  = (params.get('Body') ?? '').trim();
    const numMedia = parseInt(params.get('NumMedia') ?? '0');
    const mediaUrl = params.get('MediaUrl0') ?? '';

    const ownerRaw = process.env.OWNER_WHATSAPP ?? '';
    const ownerNum = ownerRaw.replace(/\D/g, '');
    const fromNum  = from.replace(/\D/g, '');

    const twSid   = process.env.TWILIO_ACCOUNT_SID  ?? '';
    const twToken = process.env.TWILIO_AUTH_TOKEN   ?? '';

    if (!ownerNum || !fromNum.endsWith(ownerNum)) {
      return twiml('Only the store owner can update product images.');
    }

    if (numMedia < 1 || !mediaUrl) {
      return twiml(
        'Send an image with the product SKU as the caption.\n\n' +
        'Example: send a photo, write MRNF2D442XLBV in the caption.'
      );
    }

    if (!caption) {
      return twiml(
        'Add the product SKU as a caption to your image.\n' +
        'Type "LIST" to see all SKUs.'
      );
    }

    const upper = caption.toUpperCase();

    // Special command: LIST — show all SKUs
    if (upper === 'LIST') {
      const products = await prisma.product.findMany({
        select: { sku: true, name: true },
        orderBy: { createdAt: 'desc' },
      });
      const list = products.map(p => `${p.sku}\n  ${p.name.slice(0,40)}`).join('\n\n');
      return twiml(`Products you can update:\n\n${list}`);
    }

    // Find by SKU (exact), then by name fragment
    let product = await prisma.product.findFirst({
      where: { sku: { equals: upper, mode: 'insensitive' } },
    });

    if (!product) {
      product = await prisma.product.findFirst({
        where: { name: { contains: caption, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!product) {
      return twiml(
        `"${caption}" not found.\n\n` +
        'Send "LIST" (as text, no image) to see all product SKUs.'
      );
    }

    // Upload to Cloudinary
    const cloudUrl = await uploadToCloudinary(mediaUrl, product.sku, twSid, twToken);

    // Prepend new image, drop old Unsplash placeholder images
    const kept    = (product.images ?? []).filter(img => !img.includes('unsplash.com'));
    const updated = [cloudUrl, ...kept];

    await prisma.product.update({
      where: { id: product.id },
      data:  { images: updated },
    });

    return twiml(
      `Done! Image updated for:\n${product.name.slice(0, 60)}\n\n` +
      `SKU: ${product.sku}\nThe site will show the new image immediately.\n\n` +
      'Send another image + SKU to update more products.'
    );

  } catch (err: any) {
    console.error('WhatsApp webhook error:', err);
    return twiml(`Something went wrong: ${err?.message ?? 'Unknown error'}`);
  }
}

export async function GET() {
  return new NextResponse('Smartech Kenya Image Webhook — OK', { status: 200 });
}
