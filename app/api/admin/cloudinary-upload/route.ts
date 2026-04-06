/**
 * Pure Cloudinary upload — no MongoDB.
 * GET  /api/admin/cloudinary-upload?secret=...   → auth check
 * POST /api/admin/cloudinary-upload               → { secret, imageBase64, publicId? } → { url }
 */
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function toCloudinary(b64: string, publicId: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey    = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const safeId    = publicId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const folder    = `smartech-products/${safeId}`;

  const ts  = Math.floor(Date.now() / 1000);
  const sig = await sha1(`overwrite=true&public_id=${folder}&timestamp=${ts}${apiSecret}`);

  const form = new URLSearchParams({
    file:       b64,
    public_id:  folder,
    overwrite:  'true',
    api_key:    apiKey,
    timestamp:  String(ts),
    signature:  sig,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form },
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => res.status.toString());
    throw new Error(`Cloudinary ${res.status}: ${txt}`);
  }
  return (await res.json()).secure_url as string;
}

async function sha1(str: string) {
  const raw = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(raw)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ── Auth check (no DB) ── */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ ok: true });
}

/* ── Upload ── */
export async function POST(req: NextRequest) {
  try {
    const { secret, imageBase64, publicId } = await req.json();
    if (!secret || secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!imageBase64)
      return NextResponse.json({ error: 'imageBase64 required' }, { status: 400 });

    const id  = (publicId || `upload-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const url = await toCloudinary(imageBase64, id);
    return NextResponse.json({ success: true, url, publicId: id });
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 });
  }
}
