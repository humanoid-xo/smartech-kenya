'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

/* ── Types ── */
interface Product {
  sku:      string;
  name:     string;
  brand:    string;
  category: string;
  images:   string[];
}

const CATEGORIES = [
  { value: 'SMARTPHONES',     label: 'Smartphones'      },
  { value: 'LAPTOPS',         label: 'Laptops'          },
  { value: 'HOME_APPLIANCES', label: 'Home Appliances'  },
  { value: 'KITCHEN',         label: 'Kitchen'          },
  { value: 'BEDROOM',         label: 'Bedroom'          },
  { value: 'AUDIO_TV',        label: 'Audio & TV'       },
  { value: 'ELECTRICAL',      label: 'Electrical'       },
  { value: 'SMART_HOME',      label: 'Smart Home'       },
];

const BRANDS = [
  'Mika','Hisense','Samsung','LG','Ramtons','HP',
  'Von Hotpoint','Beko','Haier','TCL','Sony','Nokia',
  'Infinix','Tecno','itel','Motorola','Other',
];

function isPlaceholder(img: string) {
  return !img || img.includes('unsplash.com');
}

/* ════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════ */
export default function AdminPage() {
  const [secret,   setSecret]   = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [tab,      setTab]      = useState<'images'|'add'>('images');
  const [status,   setStatus]   = useState<Record<string,'uploading'|'done'|'error'>>({});

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

  /* ── Upload image to existing product ── */
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
            <h1 className="text-cream font-semibold text-sm mb-6 text-center tracking-wide">
              Admin Dashboard
            </h1>
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
      {/* ── Header ── */}
      <div className="bg-ink px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Smartech Kenya" height="28"
            style={{ height:28, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.85 }} />
          <span className="text-cream/30 text-lg font-light">|</span>
          <span className="text-cream font-semibold text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cream/40 text-xs">{products.length} products</span>
          {withoutImages.length > 0 && (
            <>
              <span className="text-cream/40 text-xs">·</span>
              <span className="text-xs" style={{ color: '#C4872C' }}>{withoutImages.length} need images</span>
            </>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white border-b border-cream-warm px-6">
        <div className="max-w-[1200px] mx-auto flex gap-0">
          {([
            { key: 'images', label: 'Image Manager', icon: (
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5"/>
                <path d="M21 15l-5-5L5 21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )},
            { key: 'add',    label: 'Add New Product', icon: (
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )},
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all ${
                tab === t.key
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-faint hover:text-ink'
              }`}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">

        {/* ═══════════════════════════════════
            TAB: IMAGE MANAGER
            ═══════════════════════════════════ */}
        {tab === 'images' && (
          <>
            {/* Instructions */}
            <div className="bg-ink rounded-2xl p-6 mb-8">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color:'#C4872C' }}>
                How to upload product images
              </p>
              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  { n:'1', title:'Find the product', desc:'Products missing a real photo are shown first with an amber dot. Click any card to upload.' },
                  { n:'2', title:'Pick the photo',   desc:'Click the card (or drag a photo onto it). Choose a JPG, PNG or WebP file from your computer. Max 10MB.' },
                  { n:'3', title:'Done — live instantly', desc:'The image uploads to Cloudinary and your website updates immediately. No redeploy needed.' },
                ].map(s => (
                  <div key={s.n} className="flex gap-3">
                    <span className="font-display text-3xl font-light leading-none shrink-0" style={{ color:'rgba(217,160,80,0.30)' }}>{s.n}</span>
                    <div>
                      <p className="text-cream/80 text-xs font-semibold mb-1">{s.title}</p>
                      <p className="text-cream/45 text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs images first */}
            {withoutImages.length > 0 && (
              <div className="mb-10">
                <h2 className="font-semibold text-ink text-sm mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background:'#C4872C' }}/>
                  Needs a photo ({withoutImages.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {withoutImages.map(p => (
                    <ProductUploadCard key={p.sku} product={p} status={status[p.sku]}
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
                  Has photo — click to replace ({withImages.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {withImages.map(p => (
                    <ProductUploadCard key={p.sku} product={p} status={status[p.sku]}
                      onDrop={onDrop} onUpload={upload}/>
                  ))}
                </div>
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-ink-faint text-sm mb-4">No products in database yet.</p>
                <button onClick={() => setTab('add')}
                  className="btn-dark px-6 py-3 inline-flex items-center gap-2">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add your first product
                </button>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════
            TAB: ADD NEW PRODUCT
            ═══════════════════════════════════ */}
        {tab === 'add' && (
          <AddProductForm
            secret={secret}
            onCreated={(p: Product) => {
              setProducts(prev => [p, ...prev]);
              setTab('images');
            }}
          />
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PRODUCT UPLOAD CARD
   ═══════════════════════════════════════════════════════════ */
function ProductUploadCard({
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
      className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer ${
        dragging ? 'border-amber-400 shadow-lg scale-[1.02]' : 'border-cream-warm hover:border-ink/20'
      }`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { setDragging(false); onDrop(product.sku, e); }}
      onClick={() => inputRef.current?.click()}
    >
      {/* Image area */}
      <div className="relative aspect-square bg-cream group">
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
              <p className="text-white text-[10px] font-medium">
                {hasReal ? 'Replace photo' : 'Upload photo'}
              </p>
            </div>
          )}
        </div>

        {/* Status badges */}
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
        {!hasReal && status !== 'done' && status !== 'uploading' && (
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full" style={{ background:'#C4872C' }}/>
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
          {hasReal && <span className="text-[9px] text-ink/30 font-medium">Has photo</span>}
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


/* ═══════════════════════════════════════════════════════════
   ADD NEW PRODUCT FORM
   ═══════════════════════════════════════════════════════════ */
function AddProductForm({
  secret,
  onCreated,
}: {
  secret: string;
  onCreated: (p: Product) => void;
}) {
  const [form, setForm] = useState({
    name: '', brand: '', sku: '', category: 'KITCHEN',
    price: '', comparePrice: '', stock: '1',
    description: '', subcategory: '',
  });
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [saveMsg,  setSaveMsg]  = useState('');
  const [saveErr,  setSaveErr]  = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const pickImage = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSaveErr(''); setSaveMsg('');
    if (!form.name || !form.brand || !form.sku || !form.price) {
      setSaveErr('Name, brand, SKU and price are required.'); return;
    }
    setSaving(true);
    try {
      let imageBase64 = '';
      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise(res => {
          reader.onload = e => res(e.target?.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          name:         form.name.trim(),
          brand:        form.brand,
          sku:          form.sku.trim().toUpperCase(),
          category:     form.category,
          subcategory:  form.subcategory.trim() || undefined,
          price:        parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
          stock:        parseInt(form.stock) || 1,
          description:  form.description.trim() || undefined,
          imageBase64:  imageBase64 || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save product');

      setSaveMsg(`✓ "${form.name}" created successfully!`);
      onCreated(data.product);

      // Reset form
      setForm({ name:'', brand:'', sku:'', category:'KITCHEN', price:'', comparePrice:'', stock:'1', description:'', subcategory:'' });
      setImageFile(null); setImagePreview('');
    } catch (err: any) {
      setSaveErr(err.message ?? 'Something went wrong');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-ink font-light" style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)' }}>
          Add New Product
        </h2>
        <p className="text-ink-faint text-sm mt-1">Fill in the details and optionally upload a photo now.</p>
      </div>

      {/* Feedback banners */}
      {saveMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-xl mb-6">
          {saveMsg}
        </div>
      )}
      {saveErr && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
          {saveErr}
        </div>
      )}

      <div className="space-y-5">

        {/* Image drop zone */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-ink/40 mb-2">
            Product Image (optional — you can add later)
          </label>
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
              dragging ? 'border-amber-400 bg-amber-50' : 'border-cream-warm hover:border-ink/20 bg-cream'
            }`}
            style={{ minHeight: 160 }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickImage(f); }}
            onClick={() => inputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="flex items-center gap-5 p-5">
                <img src={imagePreview} alt="preview"
                  className="w-24 h-24 object-contain rounded-xl bg-white border border-cream-warm"/>
                <div>
                  <p className="text-ink text-sm font-medium">{imageFile?.name}</p>
                  <p className="text-ink-faint text-xs mt-0.5">
                    {imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) : '0'}MB
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview(''); }}
                    className="text-xs text-red-500 mt-2 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-12 h-12 rounded-full bg-white border border-cream-warm flex items-center justify-center mb-1">
                  <svg className="w-5 h-5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-ink">Click or drag to upload image</p>
                <p className="text-xs text-ink-faint">JPG, PNG, WebP — max 10MB</p>
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) pickImage(f); e.target.value = ''; }}/>
        </div>

        {/* Name */}
        <Field label="Product Name *">
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. Mika 442L No-Frost Fridge"
            className="field-input"/>
        </Field>

        {/* Brand + Category row */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand *">
            <select value={form.brand} onChange={e => set('brand', e.target.value)} className="field-input">
              <option value="">Select brand…</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Category *">
            <select value={form.category} onChange={e => set('category', e.target.value)} className="field-input">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
        </div>

        {/* SKU + Subcategory */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="SKU *" hint="Unique product code, e.g. MRNF2D442XLBV">
            <input type="text" value={form.sku}
              onChange={e => set('sku', e.target.value.toUpperCase().replace(/[^A-Z0-9/_-]/g,''))}
              placeholder="e.g. MKF442LSS"
              className="field-input font-mono tracking-widest text-sm"/>
          </Field>
          <Field label="Subcategory" hint="Optional — e.g. fridges, cookers">
            <input type="text" value={form.subcategory} onChange={e => set('subcategory', e.target.value)}
              placeholder="e.g. fridges"
              className="field-input"/>
          </Field>
        </div>

        {/* Price + Compare + Stock */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Price (KES) *">
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="45000"
              className="field-input"/>
          </Field>
          <Field label="Was / Compare Price" hint="Shows strike-through">
            <input type="number" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)}
              placeholder="52000"
              className="field-input"/>
          </Field>
          <Field label="Stock (units)">
            <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
              min="0"
              className="field-input"/>
          </Field>
        </div>

        {/* Description */}
        <Field label="Description">
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Key features, specs…"
            className="field-input resize-none"/>
        </Field>

        {/* Submit */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-dark w-full py-4 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin"/>
                Saving product…
              </>
            ) : (
              <>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Create Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* Style helpers — inline so they work without extra CSS */}
      <style jsx>{`
        .field-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid #E8E0D0;
          background: #fff;
          font-size: 0.875rem;
          color: #0C0C0C;
          outline: none;
          transition: border-color 0.15s;
        }
        .field-input:focus {
          border-color: rgba(12,12,12,0.3);
        }
        .field-input::placeholder {
          color: #B0A898;
        }
      `}</style>
    </div>
  );
}

/* ── Tiny helper ── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-widest uppercase text-ink/40 mb-1.5">
        {label}
        {hint && <span className="ml-2 normal-case font-normal tracking-normal text-ink/25">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
