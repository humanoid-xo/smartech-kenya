'use client';

import { useState, useRef, useCallback } from 'react';

/* ─── Types ──────────────────────────────────────── */
interface DBProduct {
  id:       string;
  sku:      string;
  name:     string;
  brand:    string;
  category: string;
  images:   string[];
}

interface UploadState {
  [sku: string]: 'idle' | 'uploading' | 'done' | 'error';
}

const CATEGORIES = [
  { value: 'SMARTPHONES',  label: 'Smartphones'     },
  { value: 'LAPTOPS',      label: 'Laptops'         },
  { value: 'KITCHEN',      label: 'Kitchen'         },
  { value: 'AUDIO_TV',     label: 'Audio & TV'      },
  { value: 'SMART_HOME',   label: 'Smart Home'      },
  { value: 'BEDROOM',      label: 'Bedroom'         },
  { value: 'ELECTRICAL',   label: 'Electrical'      },
];

const BRANDS = [
  'Mika','Hisense','Samsung','LG','Ramtons','HP',
  'Von Hotpoint','Beko','Haier','TCL','Sony','Nokia',
  'Infinix','Tecno','itel','Motorola','Other',
];

async function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = e => res(e.target!.result as string);
    r.onerror = () => rej(new Error('Read failed'));
    r.readAsDataURL(file);
  });
}

/* ─── Login Screen ────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: (secret: string, products: DBProduct[]) => void }) {
  const [pass, setPass]       = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');

  const submit = async () => {
    if (!pass.trim()) return;
    setLoading(true); setErr('');
    try {
      const res = await fetch(`/api/admin/upload-image?secret=${encodeURIComponent(pass)}`);
      if (!res.ok) { setErr('Wrong password.'); return; }
      const { products } = await res.json();
      onLogin(pass, products ?? []);
    } catch { setErr('Network error.'); }
    finally  { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Smartech Admin</h1>
          <p className="text-white/40 text-sm mt-1">Manage products &amp; images</p>
        </div>
        <div className="space-y-3">
          <input
            type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Admin password"
            className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40"
          />
          {err && <p className="text-red-400 text-xs text-center">{err}</p>}
          <button
            onClick={submit}
            disabled={loading || !pass.trim()}
            className="w-full py-3.5 rounded-xl bg-[#F97316] text-white text-sm font-bold hover:bg-orange-500 disabled:opacity-50 transition-all">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Image Manager ───────────────────────────────── */
function ImageManager({ products, secret, onRefresh }: {
  products: DBProduct[];
  secret:   string;
  onRefresh: () => void;
}) {
  const [uploadState, setUploadState] = useState<UploadState>({});
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState<'all'|'missing'|'done'>('all');

  const hasImage = (p: DBProduct) =>
    p.images.length > 0 && !p.images[0].includes('unsplash.com') && p.images[0] !== '';

  const filtered = products.filter(p => {
    const s = search.toLowerCase();
    const matchName = !search || p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s);
    const matchFilter =
      filter === 'all'     ? true :
      filter === 'missing' ? !hasImage(p) :
                             hasImage(p);
    return matchName && matchFilter;
  });

  const upload = useCallback(async (sku: string, file: File) => {
    setUploadState(s => ({ ...s, [sku]: 'uploading' }));
    try {
      const b64 = await toBase64(file);
      const res = await fetch('/api/admin/upload-image', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ secret, sku, imageBase64: b64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUploadState(s => ({ ...s, [sku]: 'done' }));
      onRefresh();
    } catch {
      setUploadState(s => ({ ...s, [sku]: 'error' }));
    }
  }, [secret, onRefresh]);

  const onDrop = useCallback((sku: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) upload(sku, file);
  }, [upload]);

  const missing = products.filter(p => !hasImage(p)).length;
  const done    = products.length - missing;

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',      value: products.length, color: 'text-ink' },
          { label: 'With image', value: done,            color: 'text-green-600' },
          { label: 'Missing',    value: missing,         color: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-cream-warm p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-ink-faint mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30 bg-white"
          />
        </div>
        <div className="flex rounded-xl border border-cream-warm overflow-hidden text-sm bg-white">
          {(['all','missing','done'] as const).map(v => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3.5 py-2 capitalize font-medium transition-colors ${
                filter === v ? 'bg-ink text-cream' : 'text-ink-faint hover:text-ink'
              }`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-faint">
          <p className="text-3xl mb-2">🔍</p>
          <p className="font-medium">No products match</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map(p => {
            const st      = uploadState[p.sku] ?? 'idle';
            const gotImg  = hasImage(p);
            const imgSrc  = gotImg ? p.images[0] : null;

            return (
              <div key={p.sku}
                onDragOver={e => e.preventDefault()}
                onDrop={e => onDrop(p.sku, e)}
                className="bg-white rounded-2xl border border-cream-warm overflow-hidden group hover:shadow-md transition-all">

                {/* Image drop zone */}
                <label className="block relative aspect-square cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { if (e.target.files?.[0]) upload(p.sku, e.target.files[0]); }}
                  />

                  {/* Image or placeholder */}
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgSrc} alt={p.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream text-ink-faint">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <span className="text-[11px] font-medium">Click or drop image</span>
                    </div>
                  )}

                  {/* Hover overlay on existing image */}
                  {imgSrc && (
                    <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-black/40 px-3 py-1.5 rounded-full">
                        Change photo
                      </span>
                    </div>
                  )}

                  {/* Upload spinner */}
                  {st === 'uploading' && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin"/>
                    </div>
                  )}

                  {/* Status badges */}
                  {st === 'done' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  )}
                  {st === 'error' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </div>
                  )}
                  {!gotImg && st === 'idle' && (
                    <div className="absolute top-2 left-2 bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      NO PHOTO
                    </div>
                  )}
                </label>

                {/* Product info */}
                <div className="p-3 border-t border-cream-warm">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-ink-faint mb-0.5">{p.brand}</p>
                  <p className="text-xs font-medium text-ink leading-snug line-clamp-2">{p.name}</p>
                  <p className="text-[10px] text-ink-faint mt-1 font-mono">{p.sku}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Add Product Form ─────────────────────────────── */
function AddProductForm({ secret, onSuccess }: { secret: string; onSuccess: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', brand: 'Mika', sku: '', category: 'KITCHEN',
    price: '', comparePrice: '', stock: '10',
    subcategory: '', description: '',
  });
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState('');
  const [error,    setError]    = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      let imageBase64 = '';
      if (imageFile) imageBase64 = await toBase64(imageFile);

      const res = await fetch('/api/admin/products', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          name:         form.name,
          brand:        form.brand,
          sku:          form.sku || undefined,   // blank = auto-generate
          category:     form.category,
          price:        parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
          stock:        parseInt(form.stock) || 10,
          subcategory:  form.subcategory || undefined,
          description:  form.description || undefined,
          imageBase64:  imageBase64 || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      setSuccess(`✓ "${data.product?.name ?? form.name}" added${data.imageUploaded ? ' with photo' : ''}!`);
      setForm({ name:'',brand:'Mika',sku:'',category:'KITCHEN',price:'',comparePrice:'',stock:'10',subcategory:'',description:'' });
      setImageFile(null); setImagePreview('');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* Image upload */}
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          Product Photo <span className="text-ink-faint font-normal">(optional)</span>
        </label>
        <div
          onDragOver={e => e.preventDefault()} onDrop={onDrop}
          className="relative border-2 border-dashed border-cream-warm rounded-2xl transition-colors hover:border-ink/20 cursor-pointer"
          onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" onChange={onImageChange} className="hidden"/>
          {imagePreview ? (
            <div className="relative h-48 rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4"/>
              <button type="button"
                onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview(''); }}
                className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full border border-cream-warm flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-ink-faint">
              <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p className="text-sm font-medium">Click to select or drag & drop</p>
              <p className="text-xs text-ink-faint/70 mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-ink mb-1.5">Product Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. MIKA 8kg Front Load Washing Machine"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30"/>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Brand *</label>
          <select required value={form.brand} onChange={e => set('brand', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30 bg-white">
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            SKU <span className="text-ink-faint font-normal">(auto if blank)</span>
          </label>
          <input value={form.sku} onChange={e => set('sku', e.target.value)}
            placeholder="MIKA-WM-8KG"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30"/>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Category *</label>
          <select required value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30 bg-white">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Subcategory</label>
          <input value={form.subcategory} onChange={e => set('subcategory', e.target.value)}
            placeholder="e.g. washing-machines"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30"/>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Price (KES) *</label>
          <input required type="number" value={form.price} onChange={e => set('price', e.target.value)}
            placeholder="48999"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30"/>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Compare Price <span className="text-ink-faint font-normal">(crossed-out)</span>
          </label>
          <input type="number" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)}
            placeholder="59999"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30"/>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Stock</label>
          <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30"/>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-ink mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Optional — a short product description"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-warm text-sm focus:outline-none focus:border-ink/30 resize-none"/>
        </div>
      </div>

      <button type="submit" disabled={saving || !form.name || !form.price}
        className="w-full py-3.5 bg-ink text-cream font-bold rounded-xl hover:bg-ink-soft disabled:opacity-50 transition-all text-sm">
        {saving ? 'Saving…' : 'Add Product'}
      </button>
    </form>
  );
}

/* ─── Main Admin Page ──────────────────────────────── */
export default function AdminPage() {
  const [secret,   setSecret]   = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [tab,      setTab]      = useState<'images'|'add'>('images');

  const handleLogin = (s: string, p: DBProduct[]) => {
    setSecret(s); setProducts(p); setAuthed(true);
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch(`/api/admin/upload-image?secret=${encodeURIComponent(secret)}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
      }
    } catch { /* ignore */ }
  };

  if (!authed) return <LoginScreen onLogin={handleLogin}/>;

  const tabs = [
    { id: 'images', label: 'Manage Photos' },
    { id: 'add',    label: 'Add Product'   },
  ] as const;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="bg-ink text-cream px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-base tracking-tight">Smartech Admin</h1>
          <p className="text-cream/40 text-xs mt-0.5">
            {products.length} products · {products.filter(p => p.images.length > 0 && !p.images[0].includes('unsplash')).length} with photos
          </p>
        </div>
        <button onClick={() => { setAuthed(false); setSecret(''); }}
          className="text-cream/40 hover:text-cream text-xs border border-cream/15 px-3 py-1.5 rounded-lg transition-colors">
          Sign out
        </button>
      </div>

      {/* Tab nav */}
      <div className="border-b border-cream-warm bg-white">
        <div className="max-w-5xl mx-auto px-6 flex gap-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                tab === t.id
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-faint hover:text-ink'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === 'images' && (
          <ImageManager
            products={products}
            secret={secret}
            onRefresh={refreshProducts}
          />
        )}
        {tab === 'add' && (
          <AddProductForm
            secret={secret}
            onSuccess={() => { refreshProducts(); setTab('images'); }}
          />
        )}
      </div>
    </div>
  );
}
