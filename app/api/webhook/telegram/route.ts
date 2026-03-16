/**
 * Telegram Bot Image Webhook — Smartech Kenya
 * ─────────────────────────────────────────────
 * 100% FREE. No Twilio. No paid plan ever.
 *
 * HOW IT WORKS:
 *  1. You create a free Telegram bot via @BotFather (takes 2 min)
 *  2. Owner opens Telegram, sends the bot a photo with SKU as caption
 *  3. This webhook receives the message, downloads the photo,
 *     uploads it to Cloudinary, updates the product in MongoDB,
 *     and sends a confirmation reply back in Telegram.
 *
 * SETUP (one-time, 5 minutes):
 *  1. Open Telegram → search @BotFather → /newbot
 *  2. Follow prompts → copy the bot token
 *  3. Add to Vercel env vars:
 *       TELEGRAM_BOT_TOKEN = 7123456789:AAFabc...xyz
 *       TELEGRAM_OWNER_ID  = your Telegram numeric user ID
 *                            (send /start to @userinfobot to get it)
 *  4. Register webhook URL (run once after deploy):
 *       GET /api/webhook/telegram?setup=1&secret=YOUR_ADMIN_SECRET
 *  5. Done — send the bot a photo with SKU as caption
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

const TG_API = (token: string) => `https://api.telegram.org/bot${token}`;

// ── Send a Telegram reply ────────────────────────────────────────────────────
async function reply(token: string, chatId: number, text: string) {
  await fetch(`${TG_API(token)}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

// ── Get highest-resolution photo URL from Telegram ──────────────────────────
async function getPhotoUrl(token: string, fileId: string): Promise<string> {
  const res  = await fetch(`${TG_API(token)}/getFile?file_id=${fileId}`);
  const data = await res.json();
  if (!data.ok) throw new Error('Could not get file path from Telegram');
  const path = data.result.file_path;
  return `https://api.telegram.org/file/bot${token}/${path}`;
}

// ── Download image from Telegram (no auth needed for file URLs) ──────────────
async function downloadImage(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // Detect MIME type from first bytes
  const mime = buf[0] === 0xff && buf[1] === 0xd8 ? 'image/jpeg'
             : buf[0] === 0x89 && buf[1] === 0x50 ? 'image/png'
             : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// ── Upload to Cloudinary ─────────────────────────────────────────────────────
async function uploadToCloudinary(b64: string, sku: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey    = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const safeId    = sku.replace(/[^a-zA-Z0-9_-]/g, '_');

  const ts  = Math.floor(Date.now() / 1000);
  const str = `overwrite=true&public_id=smartech-products/${safeId}&timestamp=${ts}${apiSecret}`;
  const raw = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  const sig  = Array.from(new Uint8Array(raw)).map(b => b.toString(16).padStart(2, '0')).join('');

  const form = new URLSearchParams();
  form.set('file',      b64);
  form.set('public_id', `smartech-products/${safeId}`);
  form.set('overwrite', 'true');
  form.set('api_key',   apiKey);
  form.set('timestamp', String(ts));
  form.set('signature', sig);

  const up = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form }
  );
  if (!up.ok) throw new Error(`Cloudinary upload failed: ${up.status}`);
  const data = await up.json();
  return data.secure_url as string;
}

// ── Main POST handler (Telegram sends updates here) ──────────────────────────
export async function POST(req: NextRequest) {
  const token   = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = process.env.TELEGRAM_OWNER_ID;

  if (!token) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 });
  }

  let update: any;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const msg    = update?.message;
  if (!msg) return NextResponse.json({ ok: true }); // ignore non-message updates

  const chatId = msg.chat?.id as number;
  const fromId = String(msg.from?.id ?? '');
  const caption = (msg.caption ?? msg.text ?? '').trim();

  // Security: only respond to the owner
  if (ownerId && fromId !== ownerId) {
    await reply(token, chatId, '⛔ Unauthorized. This bot is for store admin only.');
    return NextResponse.json({ ok: true });
  }

  // ── Text-only commands ──────────────────────────────────────────────────
  if (!msg.photo && msg.text) {
    const cmd = msg.text.trim().toUpperCase();

    if (cmd === '/START' || cmd === 'HELP') {
      await reply(token, chatId,
        `<b>Smartech Kenya Image Bot</b>\n\n` +
        `Send me a product photo with the <b>SKU code</b> as the caption.\n\n` +
        `Example: send a photo → caption: <code>MRNF2D442XLBV</code>\n\n` +
        `Commands:\n` +
        `<code>LIST</code> — show all product SKUs\n` +
        `<code>SEARCH name</code> — find a product by name`
      );
      return NextResponse.json({ ok: true });
    }

    if (cmd === 'LIST') {
      try {
        const products = await prisma.product.findMany({
          select: { sku: true, name: true, images: true },
          orderBy: { name: 'asc' },
        });
        const noPhoto = products.filter(p => !p.images.length || p.images[0]?.includes('unsplash'));
        const hasPhoto = products.filter(p => p.images.length && !p.images[0]?.includes('unsplash'));

        let msg = `<b>Products needing photos (${noPhoto.length}):</b>\n`;
        noPhoto.forEach(p => { msg += `\n<code>${p.sku}</code>  ${p.name.slice(0, 35)}`; });
        if (hasPhoto.length) {
          msg += `\n\n<b>Has photo (${hasPhoto.length}):</b>\n`;
          hasPhoto.forEach(p => { msg += `\n<code>${p.sku}</code>  ${p.name.slice(0, 35)}`; });
        }
        await reply(token, chatId, msg);
      } catch (e: any) {
        await reply(token, chatId, `Error fetching products: ${e.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    if (cmd.startsWith('SEARCH ')) {
      const q = caption.slice(7).trim();
      try {
        const products = await prisma.product.findMany({
          where: { OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { sku:  { contains: q, mode: 'insensitive' } },
            { brand:{ contains: q, mode: 'insensitive' } },
          ]},
          select: { sku: true, name: true },
          take: 10,
        });
        if (!products.length) {
          await reply(token, chatId, `No products found for "${q}"`);
        } else {
          const list = products.map(p => `<code>${p.sku}</code>  ${p.name.slice(0, 40)}`).join('\n');
          await reply(token, chatId, `<b>Found ${products.length}:</b>\n\n${list}`);
        }
      } catch (e: any) {
        await reply(token, chatId, `Search error: ${e.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    await reply(token, chatId,
      `Send <b>LIST</b> to see all SKUs, or send a photo with SKU as caption.\n` +
      `<code>SEARCH fridge</code> — search by name`
    );
    return NextResponse.json({ ok: true });
  }

  // ── Photo message ───────────────────────────────────────────────────────
  if (msg.photo) {
    if (!caption) {
      await reply(token, chatId,
        `Please add the <b>SKU code</b> as a caption to your photo.\n\n` +
        `Send <b>LIST</b> to see all product SKUs.`
      );
      return NextResponse.json({ ok: true });
    }

    const upper = caption.toUpperCase();

    // Find product — SKU exact match first, then name fragment
    let product = await prisma.product.findFirst({
      where: { sku: { equals: upper, mode: 'insensitive' } },
    }).catch(() => null);

    if (!product) {
      product = await prisma.product.findFirst({
        where: { name: { contains: caption, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      }).catch(() => null);
    }

    if (!product) {
      await reply(token, chatId,
        `❌ Product "<b>${caption}</b>" not found.\n\n` +
        `Send <b>LIST</b> to see all SKU codes, or <b>SEARCH ${caption}</b> to search.`
      );
      return NextResponse.json({ ok: true });
    }

    await reply(token, chatId, `⏳ Uploading photo for <b>${product.name.slice(0, 50)}</b>…`);

    try {
      // Get the largest photo variant Telegram provides
      const photos  = msg.photo as any[];
      const largest = photos.reduce((a: any, b: any) => (b.file_size > a.file_size ? b : a));
      const photoUrl = await getPhotoUrl(token, largest.file_id);
      const b64      = await downloadImage(photoUrl);
      const imageUrl = await uploadToCloudinary(b64, product.sku);

      // Update product — replace Unsplash placeholders, keep real images
      const kept    = (product.images ?? []).filter(img => !img.includes('unsplash.com'));
      const updated = [imageUrl, ...kept];

      await prisma.product.update({
        where: { id: product.id },
        data:  { images: updated },
      });

      await reply(token, chatId,
        `✅ <b>Done!</b> Image updated for:\n` +
        `${product.name.slice(0, 60)}\n\n` +
        `SKU: <code>${product.sku}</code>\n` +
        `The site shows the new image immediately.\n\n` +
        `Send another photo + SKU to update more products.`
      );
    } catch (err: any) {
      console.error('Telegram image upload error:', err);
      await reply(token, chatId, `❌ Upload failed: ${err?.message ?? 'Unknown error'}\n\nPlease try again.`);
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

// ── GET: register webhook URL or health check ────────────────────────────────
export async function GET(req: NextRequest) {
  const setup  = req.nextUrl.searchParams.get('setup');
  const secret = req.nextUrl.searchParams.get('secret');

  // Health check
  if (!setup) {
    return NextResponse.json({ status: 'Smartech Kenya Telegram Webhook — OK' });
  }

  // Register the webhook with Telegram (run once after deploy)
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Wrong secret' }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 });
  }

  const appUrl  = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  const hookUrl = `${appUrl}/api/webhook/telegram`;

  const res  = await fetch(`${TG_API(token)}/setWebhook`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ url: hookUrl, drop_pending_updates: true }),
  });
  const data = await res.json();

  return NextResponse.json({
    telegram: data,
    webhook:  hookUrl,
    message:  data.ok
      ? `✅ Webhook registered at ${hookUrl}`
      : `❌ Failed: ${data.description}`,
  });
}
