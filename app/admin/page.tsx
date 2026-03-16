'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface Product {
  sku:      string;
  name:     string;
  brand:    string;
  category: string;
  images:   string[];
}

function isPlaceholder(img: string) {
  return !img || img.includes('unsplash.com');
}

export default function AdminPage() {
  const [secret,   setSecret]   = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [status,   setStatus]   = useState<Record<string, 'uploading' | 'done' | 'error'>>({});

  /* ── Auth ── */
  const login = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/admin/upload-image?secret=${encodeURIComponent(secret)}`);
      if (!res.ok) { setError('Wrong password.'); setLoading(false); return; }
      const { products: p } = await res.json();
      setProducts(p);
      setAuthed(true);
    } catch { setError('Connection error.'); }
    setLoading(false);
  };

  /* ── Upload ── */
  const upload = useCallback(async (sku: string, file: File) => {
    setStatus(s => ({ ...s, [sku]: 'uploading' }));
    try {
      const reader = new FileReader();
      const b64: string = await new Promise(res => {
        reader.onload = e => res(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const resp = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, sku, imageBase64: b64 }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      // Update local product list with new image
      setProducts(prev => prev.map(p =>
        p.sku === sku
          ? { ...p, images: [data.imageUrl, ...p.images.filter(i => !i.includes('unsplash'))] }
          : p
      ));
      setStatus(s => ({ ...s, [sku]: 'done' }));
    } catch (err: any) {
      console.error(err);
      setStatus(s => ({ ...s, [sku]: 'error' }));
    }
  }, [secret]);

  /* ── Drag + drop per card ── */
  const onDrop = useCallback((sku: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) upload(sku, file);
  }, [upload]);

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-10">
            <img src="/logo.png" alt="Smartech Kenya" width="140" height="38"
              style={{ objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.9 }} />
          </div>

          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-8">
            <h1 className="text-cream font-semibold text-sm mb-6 text-center">Image Manager</h1>
            {error && (
              <div className="bg-red-900/40 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            <input
              type="password"
              placeholder="Admin password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-cream text-sm placeholder-cream/30 focus:outline-none focus:border-amber-400/50 mb-3"
            />
            <button onClick={login} disabled={loading || !secret}
              className="w-full py-3 bg-white text-ink text-sm font-semibold rounded-xl hover:bg-cream disabled:opacity-40 transition-all">
              {loading ? 'Checking…' : 'Enter'}
            </button>
          </div>
          <p className="text-cream/20 text-xs text-center mt-4">
            Set ADMIN_SECRET in Vercel environment variables
          </p>
        </div>
      </div>
    );
  }

  const withImages    = products.filter(p => p.images.length > 0 && !isPlaceholder(p.images[0]));
  const withoutImages = products.filter(p => p.images.length === 0 || isPlaceholder(p.images[0]));

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-ink px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 9C3 5.686 5.686 3 9 3s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" stroke="#F5F0E8" strokeWidth="1.5"/>
              <path d="M6.5 9h5M9 6.5v5" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-cream font-semibold text-sm">Image Manager</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cream/40 text-xs">{products.length} products</span>
          <span className="text-cream/40 text-xs">·</span>
          <span className="text-xs" style={{ color: '#C4872C' }}>{withoutImages.length} need images</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">

        {/* Instructions */}
        <div className="bg-ink rounded-2xl p-6 mb-8 grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color:'#C4872C' }}>
              Method 1 — Telegram Bot (free, easiest)
            </p>
            <ol className="text-cream/55 text-xs leading-relaxed space-y-1.5 list-decimal list-inside">
              <li>Open Telegram → search <strong className="text-cream/80">@BotFather</strong> → type <code className="bg-white/10 px-1 rounded">/newbot</code></li>
              <li>Follow the prompts — get your <strong className="text-cream/80">bot token</strong></li>
              <li>Add <code className="bg-white/10 px-1 rounded">TELEGRAM_BOT_TOKEN</code> to Vercel env vars</li>
              <li>Get your Telegram user ID from <strong className="text-cream/80">@userinfobot</strong></li>
              <li>Add <code className="bg-white/10 px-1 rounded">TELEGRAM_OWNER_ID</code> to Vercel env vars</li>
              <li>Visit <code className="bg-white/10 px-1 rounded">/api/webhook/telegram?setup=1&secret=YOUR_ADMIN_SECRET</code></li>
              <li>Now send your bot a photo — caption = SKU code. Done!</li>
            </ol>
            <p className="text-cream/25 text-[10px] mt-3">
              Send <code className="bg-white/10 px-1 rounded text-cream/50">LIST</code> to the bot (no photo) to get all SKU codes.
              Send <code className="bg-white/10 px-1 rounded text-cream/50">SEARCH fridge</code> to find products by name.
              100% free — no Twilio, no subscription.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3 text-cream/40">
              Method 2 — This page
            </p>
            <p className="text-cream/55 text-xs leading-relaxed">
              Drag an image onto any product card below, or click the upload area.
              The image uploads to Cloudinary and updates the site immediately.
              <br/><br/>
              Supported: JPG, PNG, WebP. Max 10MB per image.
            </p>
          </div>
        </div>

        {/* Needs images first */}
        {withoutImages.length > 0 && (
          <div className="mb-10">
            <h2 className="font-semibold text-ink text-sm mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-luxe"/>
              Needs a photo ({withoutImages.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {withoutImages.map(p => (
                <ProductCard key={p.sku} product={p} status={status[p.sku]}
                  onDrop={onDrop} onUpload={upload}/>
              ))}
            </div>
          </div>
        )}

        {/* Has images */}
        {withImages.length > 0 && (
          <div>
            <h2 className="font-semibold text-ink text-sm mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ink/40"/>
              Has photo — tap to replace ({withImages.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {withImages.map(p => (
                <ProductCard key={p.sku} product={p} status={status[p.sku]}
                  onDrop={onDrop} onUpload={upload}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ── SKU Generator Component ───────────────────────────────────────────────── */
function SkuGenerator() {
  const [brand,   setBrand]   = useState('');
  const [type,    setType]    = useState('');
  const [model,   setModel]   = useState('');
  const [variant, setVariant] = useState('');
  const [manual,  setManual]  = useState('');
  const [copied,  setCopied]  = useState(false);

  // Auto-generate from parts: BRAND-TYPE-MODEL-VARIANT
  // e.g. MIKA-FRIDGE-442L-SBS → MKF442SBS
  const generated = (() => {
    if (!brand && !type) return '';
    const b = brand.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const t = type.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
    const m = model.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const v = variant.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
    return [b, t, m, v].filter(Boolean).join('');
  })();

  const sku = manual || generated;

  const copy = () => {
    if (!sku) return;
    navigator.clipboard.writeText(sku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const BRAND_SHORTCUTS: Record<string, string> = {
    'Mika': 'MK', 'Hisense': 'HIS', 'Samsung': 'SAM', 'LG': 'LG',
    'Ramtons': 'RAM', 'HP': 'HP', 'Von Hotpoint': 'VON', 'Beko': 'BKO',
  };
  const TYPE_SHORTCUTS: Record<string, string> = {
    'Fridge': 'FR', 'Washing Machine': 'WM', 'Water Dispenser': 'WD',
    'Gas Hob': 'GH', 'Hood': 'HD', 'Cooker': 'CK', 'Microwave': 'MW',
    'TV': 'TV', 'Smartphone': 'PH', 'Laptop': 'LP', 'Audio': 'AU',
    'Air Conditioner': 'AC',
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Brand */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-ink/40 mb-1.5">Brand</label>
          <select value={brand} onChange={e => setBrand(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-cream-warm bg-white text-sm text-ink focus:outline-none focus:border-amber-luxe">
            <option value="">Select…</option>
            {Object.keys(BRAND_SHORTCUTS).map(b => <option key={b} value={BRAND_SHORTCUTS[b]}>{b}</option>)}
            <option value="CUSTOM">Other…</option>
          </select>
        </div>

        {/* Product type */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-ink/40 mb-1.5">Type</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-cream-warm bg-white text-sm text-ink focus:outline-none focus:border-amber-luxe">
            <option value="">Select…</option>
            {Object.keys(TYPE_SHORTCUTS).map(t => <option key={t} value={TYPE_SHORTCUTS[t]}>{t}</option>)}
          </select>
        </div>

        {/* Model/size */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-ink/40 mb-1.5">
            Size / Model
          </label>
          <input type="text" value={model} onChange={e => setModel(e.target.value)}
            placeholder="e.g. 442L, 8KG, 55IN"
            className="w-full px-3 py-2 rounded-xl border border-cream-warm bg-white text-sm text-ink focus:outline-none focus:border-amber-luxe placeholder-cream-muted"/>
        </div>

        {/* Colour/variant */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-ink/40 mb-1.5">
            Colour / Variant
          </label>
          <input type="text" value={variant} onChange={e => setVariant(e.target.value)}
            placeholder="e.g. SS, BLK, WHT"
            className="w-full px-3 py-2 rounded-xl border border-cream-warm bg-white text-sm text-ink focus:outline-none focus:border-amber-luxe placeholder-cream-muted"/>
        </div>
      </div>

      {/* Result + override */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-ink/40 mb-1.5">
            Generated SKU — or type your own
          </label>
          <input type="text" value={manual || generated}
            onChange={e => setManual(e.target.value.toUpperCase().replace(/[^A-Z0-9/_-]/g, ''))}
            placeholder="SKU will appear here"
            className="w-full px-4 py-3 rounded-xl border-2 border-cream-warm bg-cream font-mono text-ink text-sm font-semibold tracking-widest focus:outline-none focus:border-amber-luxe uppercase"/>
        </div>
        <button onClick={copy} disabled={!sku}
          className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            copied
              ? 'bg-ink text-cream'
              : 'bg-cream-warm text-ink hover:bg-ink hover:text-cream disabled:opacity-30'
          }`}>
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              Copy SKU
            </>
          )}
        </button>
        <button onClick={() => { setBrand(''); setType(''); setModel(''); setVariant(''); setManual(''); }}
          className="px-4 py-3 rounded-xl text-sm text-ink-faint hover:text-ink border border-cream-warm hover:border-ink/20 transition-all">
          Clear
        </button>
      </div>

      {/* Explanation */}
      <div className="bg-cream-warm/50 rounded-xl p-4">
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong className="text-ink">What is a SKU?</strong>&nbsp;
          A SKU (Stock Keeping Unit) is a short unique code for each product — like a licence plate.
          It&apos;s used to identify products when uploading images via Telegram or the admin page.
          Example: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-xs">MKF442LSS</code> =
          Mika Fridge 442L Stainless Steel.
          The manufacturer&apos;s model number (e.g. MRNF2D442XLBV) is the best SKU to use when it exists.
        </p>
      </div>
    </div>
  );
}

/* ── Product card ── */
function ProductCard({
  product, status, onDrop, onUpload,
}: {
  product:  Product;
  status?:  'uploading' | 'done' | 'error';
  onDrop:   (sku: string, e: React.DragEvent) => void;
  onUpload: (sku: string, file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasReal  = product.images.length > 0 && !isPlaceholder(product.images[0]);

  return (
    <div
      className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
        dragging ? 'border-amber-400 shadow-lg scale-[1.02]' : 'border-cream-warm'
      }`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { setDragging(false); onDrop(product.sku, e); }}
    >
      {/* Image area */}
      <div
        className="relative aspect-square bg-cream cursor-pointer group"
        onClick={() => inputRef.current?.click()}
      >
        {hasReal ? (
          <Image src={product.images[0]} alt={product.name} fill
            sizes="25vw" className="object-contain p-4"/>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg className="w-8 h-8 text-cream-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/>
            </svg>
            <p className="text-[10px] text-cream-muted font-medium">No photo yet</p>
          </div>
        )}

        {/* Upload hover overlay */}
        <div className="absolute inset-0 bg-ink/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {status === 'uploading' ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>
          ) : (
            <div className="text-center">
              <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <p className="text-white text-[10px] font-medium">Upload photo</p>
            </div>
          )}
        </div>

        {/* Status badge */}
        {status === 'done' && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-ink rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[9px] font-bold tracking-widest uppercase text-cream-muted mb-0.5">{product.brand}</p>
        <p className="text-ink text-xs font-medium leading-tight line-clamp-2 mb-1.5">{product.name}</p>
        <div className="flex items-center justify-between">
          <code className="text-[9px] text-ink-faint bg-cream-warm px-1.5 py-0.5 rounded font-mono">
            {product.sku}
          </code>
          {hasReal && (
            <span className="text-[9px] text-ink/30 font-medium">Has photo</span>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onUpload(product.sku, f);
          e.target.value = '';
        }}/>
    </div>
  );
}
