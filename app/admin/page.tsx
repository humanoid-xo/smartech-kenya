'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

/* ── Types ── */
interface Product {
  sku:      string;
  name:     string;
  brand:    string;
  category: string;
  images:   string[];
}

interface UploadJob {
  file:    File;
  sku:     string;
  name:    string;
  status:  'pending' | 'uploading' | 'done' | 'error' | 'no-match';
  url?:    string;
  error?:  string;
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

/** Match a filename (without extension) to a product SKU or name slug */
function matchFile(filename: string, products: Product[]): Product | null {
  const base = filename.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/g, '-');
  // exact SKU match
  const bySku = products.find(p => p.sku.toLowerCase().replace(/[^a-z0-9]/g, '-') === base);
  if (bySku) return bySku;
  // partial SKU match
  const skuPartial = products.find(p => base.includes(p.sku.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 6)));
  if (skuPartial) return skuPartial;
  // name slug match
  const byName = products.find(p => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
    return base.includes(slug.substring(0, 15)) || slug.includes(base.substring(0, 15));
  });
  return byName ?? null;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = e => res(e.target!.result as string);
    r.onerror = () => rej(new Error('read failed'));
    r.readAsDataURL(file);
  });
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [secret,   setSecret]   = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [tab,      setTab]      = useState<'folder'|'images'|'add'>('folder');

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

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#2E1065] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
            <p className="text-white/50 text-sm mt-1">Smartech Kenya</p>
          </div>
          <div className="space-y-3">
            <input
              type="password" value={secret} onChange={e => setSecret(e.target.value)}
              placeholder="Admin password"
              onKeyDown={e => e.key === 'Enter' && login()}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-400"
            />
            {error && <p className="text-red-300 text-xs text-center">{error}</p>}
            <button onClick={login} disabled={loading || !secret.trim()}
              className="w-full py-3 rounded-xl bg-white text-[#6D28D9] text-sm font-bold hover:bg-purple-50 disabled:opacity-50 transition-all">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const noImage  = products.filter(p => isPlaceholder(p.images[0])).length;
  const hasImage = products.length - noImage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2E1065] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">Admin Panel</h1>
          <p className="text-white/50 text-xs">{products.length} products · {hasImage} with images · {noImage} need images</p>
        </div>
        <button onClick={() => setAuthed(false)}
          className="text-white/50 hover:text-white text-xs border border-white/20 px-3 py-1.5 rounded-lg transition-colors">
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex gap-1">
          {([
            { id: 'folder', label: '📁 Folder Upload', desc: 'Upload whole folder' },
            { id: 'images', label: '🖼 Image Manager', desc: 'Per-product upload' },
            { id: 'add',    label: '➕ Add Product',   desc: 'New product form'  },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                tab === t.id
                  ? 'border-[#6D28D9] text-[#6D28D9]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === 'folder' && <FolderUpload products={products} secret={secret} onDone={p => setProducts(p)} />}
        {tab === 'images' && <ImageManager products={products} secret={secret} onUpdate={p => setProducts(p)} />}
        {tab === 'add'    && <AddProduct   secret={secret} />}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   FOLDER UPLOAD TAB
   ════════════════════════════════════════════════════════ */
function FolderUpload({ products, secret, onDone }: {
  products: Product[];
  secret:   string;
  onDone:   (p: Product[]) => void;
}) {
  const [jobs,     setJobs]     = useState<UploadJob[]>([]);
  const [running,  setRunning]  = useState(false);
  const [drag,     setDrag]     = useState(false);
  const folderRef  = useRef<HTMLInputElement>(null);
  const filesRef   = useRef<HTMLInputElement>(null);

  const buildJobs = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newJobs: UploadJob[] = arr.map(file => {
      const match = matchFile(file.name, products);
      return {
        file,
        sku:    match?.sku  ?? '',
        name:   match?.name ?? '(no match)',
        status: match ? 'pending' : 'no-match',
      };
    });
    setJobs(newJobs);
  }, [products]);

  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) buildJobs(e.target.files);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const items = e.dataTransfer.items;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const f = items[i].getAsFile();
      if (f && f.type.startsWith('image/')) files.push(f);
    }
    if (files.length) buildJobs(files);
  };

  const runUploads = async () => {
    setRunning(true);
    const pending = jobs.filter(j => j.status === 'pending');
    for (const job of pending) {
      setJobs(prev => prev.map(j => j.file === job.file ? { ...j, status: 'uploading' } : j));
      try {
        const b64 = await fileToBase64(job.file);
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, sku: job.sku, imageBase64: b64 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        setJobs(prev => prev.map(j => j.file === job.file ? { ...j, status: 'done', url: data.imageUrl } : j));
      } catch (err: any) {
        setJobs(prev => prev.map(j => j.file === job.file ? { ...j, status: 'error', error: err.message } : j));
      }
    }
    setRunning(false);
  };

  const matched   = jobs.filter(j => j.status !== 'no-match').length;
  const unmatched = jobs.filter(j => j.status === 'no-match').length;
  const done      = jobs.filter(j => j.status === 'done').length;
  const errors    = jobs.filter(j => j.status === 'error').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Folder / Bulk Image Upload</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select a folder or multiple images. Files are matched to products by filename → SKU.
          Rename files to match product SKUs (e.g. <code className="bg-gray-100 px-1 rounded">MIKA-WM-8KG.jpg</code>).
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          drag ? 'border-[#6D28D9] bg-purple-50' : 'border-gray-300 bg-white hover:border-purple-300'
        }`}>
        <div className="text-4xl mb-3">📂</div>
        <p className="text-gray-700 font-semibold">Drag & drop images here</p>
        <p className="text-gray-400 text-sm mt-1">or choose how to select:</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button onClick={() => folderRef.current?.click()}
            className="px-4 py-2 bg-[#6D28D9] text-white text-sm font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors">
            📁 Select Folder
          </button>
          <button onClick={() => filesRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            🖼 Select Files
          </button>
        </div>
        {/* Hidden inputs */}
        <input ref={folderRef} type="file" multiple accept="image/*"
          // @ts-ignore
          webkitdirectory="" directory=""
          onChange={onFolderChange} className="hidden" />
        <input ref={filesRef} type="file" multiple accept="image/*"
          onChange={e => e.target.files && buildJobs(e.target.files)} className="hidden" />
      </div>

      {/* Match tip */}
      {products.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-semibold mb-2">💡 How filename matching works</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            {products.slice(0, 4).map(p => (
              <div key={p.sku} className="bg-white/60 rounded-lg px-3 py-1.5">
                <span className="font-mono font-bold">{p.sku.toLowerCase().replace(/[^a-z0-9]/g,'-')}.jpg</span>
                <span className="text-blue-400 mx-1">→</span>
                <span className="truncate">{p.name.substring(0, 25)}…</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job list */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-700 font-semibold">{jobs.length} files</span>
              {matched   > 0 && <span className="text-green-600">✓ {matched} matched</span>}
              {unmatched > 0 && <span className="text-orange-500">⚠ {unmatched} unmatched</span>}
              {done      > 0 && <span className="text-purple-600">↑ {done} uploaded</span>}
              {errors    > 0 && <span className="text-red-500">✗ {errors} failed</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setJobs([])}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 transition-colors">
                Clear
              </button>
              {matched > done && (
                <button onClick={runUploads} disabled={running}
                  className="px-4 py-1.5 bg-[#6D28D9] text-white text-sm font-semibold rounded-lg hover:bg-[#7C3AED] disabled:opacity-50 transition-colors">
                  {running ? 'Uploading…' : `Upload ${matched - done} matched`}
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
            {jobs.map((job, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={URL.createObjectURL(job.file)} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{job.file.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {job.status === 'no-match' ? '⚠ No matching product' : `→ ${job.name} (${job.sku})`}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  {job.status === 'pending'    && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Pending</span>}
                  {job.status === 'uploading'  && <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full animate-pulse">Uploading…</span>}
                  {job.status === 'done'       && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">✓ Done</span>}
                  {job.status === 'error'      && <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full" title={job.error}>✗ Failed</span>}
                  {job.status === 'no-match'   && <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full">No match</span>}
                </div>

                {/* Override SKU for unmatched */}
                {job.status === 'no-match' && (
                  <select
                    onChange={e => setJobs(prev => prev.map((j, idx) => idx === i
                      ? { ...j, sku: e.target.value, name: products.find(p=>p.sku===e.target.value)?.name??'', status: e.target.value ? 'pending' : 'no-match' }
                      : j))}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-700 shrink-0 max-w-[160px]">
                    <option value="">Assign to product…</option>
                    {products.map(p => (
                      <option key={p.sku} value={p.sku}>{p.name.substring(0, 30)}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   IMAGE MANAGER TAB
   ════════════════════════════════════════════════════════ */
function ImageManager({ products, secret, onUpdate }: {
  products: Product[];
  secret:   string;
  onUpdate: (p: Product[]) => void;
}) {
  const [status,  setStatus]  = useState<Record<string,'uploading'|'done'|'error'>>({});
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState<'all'|'missing'|'done'>('all');

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'missing' ? isPlaceholder(p.images[0]) : !isPlaceholder(p.images[0]);
    return matchSearch && matchFilter;
  });

  const upload = useCallback(async (sku: string, file: File) => {
    setStatus(s => ({ ...s, [sku]: 'uploading' }));
    try {
      const b64 = await fileToBase64(file);
      const resp = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, sku, imageBase64: b64 }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      onUpdate(products.map(p =>
        p.sku === sku ? { ...p, images: [data.imageUrl, ...p.images.filter(i => !i.includes('unsplash'))] } : p
      ));
      setStatus(s => ({ ...s, [sku]: 'done' }));
    } catch {
      setStatus(s => ({ ...s, [sku]: 'error' }));
    }
  }, [secret, products, onUpdate]);

  const onDrop = useCallback((sku: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) upload(sku, file);
  }, [upload]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 bg-white"/>
        </div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white text-sm">
          {([['all','All'],['missing','Need image'],['done','Has image']] as const).map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-2 font-medium transition-colors ${filter===v ? 'bg-[#6D28D9] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(p => {
          const st    = status[p.sku];
          const hasImg = !isPlaceholder(p.images[0]);
          return (
            <div key={p.sku}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(p.sku, e)}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
              {/* Image area */}
              <label className="block relative aspect-square bg-gray-50 cursor-pointer overflow-hidden">
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && upload(p.sku, e.target.files[0])} />
                {hasImg ? (
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"/>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M12 4v16m8-8H4"/>
                    </svg>
                    <span className="text-xs font-medium">Click or drag image</span>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${hasImg ? 'opacity-0 group-hover:opacity-100 bg-black/30' : ''}`}>
                  {hasImg && (
                    <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full">
                      Change image
                    </span>
                  )}
                </div>
                {/* Upload status */}
                {st === 'uploading' && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#6D28D9] border-t-transparent rounded-full animate-spin"/>
                  </div>
                )}
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
                {/* No-image badge */}
                {!hasImg && !st && (
                  <div className="absolute top-2 left-2 bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    NO IMAGE
                  </div>
                )}
              </label>
              {/* Info */}
              <div className="p-3">
                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">{p.brand}</p>
                <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2">{p.name}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-mono">{p.sku}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="font-medium">No products match</p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ADD PRODUCT TAB
   ════════════════════════════════════════════════════════ */
function AddProduct({ secret }: { secret: string }) {
  const [form, setForm] = useState({
    name: '', brand: 'Mika', sku: '', category: 'KITCHEN',
    price: '', comparePrice: '', stock: '10',
    subcategory: '', description: '',
  });
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setPreview]  = useState('');
  const [saving,  setSaving]        = useState(false);
  const [success, setSuccess]       = useState('');
  const [error,   setError]         = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) { setImageFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      let imageBase64 = '';
      if (imageFile) imageBase64 = await fileToBase64(imageFile);
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          name:         form.name,
          brand:        form.brand,
          sku:          form.sku || undefined,
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
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setSuccess(`✓ Product "${data.product?.name ?? form.name}" added successfully!`);
      setForm({ name:'',brand:'Mika',sku:'',category:'KITCHEN',price:'',comparePrice:'',stock:'10',subcategory:'',description:'' });
      setImageFile(null); setPreview('');
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}
      {error   && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {/* Image upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
        <label
          onDragOver={e => e.preventDefault()} onDrop={onDrop}
          className="block border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-purple-400 transition-colors">
          <input type="file" accept="image/*" onChange={onImage} className="hidden" />
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-contain mx-auto rounded-xl"/>
          ) : (
            <div className="text-gray-400">
              <div className="text-3xl mb-2">🖼</div>
              <p className="text-sm">Click or drag image here</p>
            </div>
          )}
        </label>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="MIKA 8kg Front Load Inverter Washing Machine"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"/>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brand *</label>
          <select required value={form.brand} onChange={e => set('brand', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 bg-white">
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU</label>
          <input value={form.sku} onChange={e => set('sku', e.target.value)}
            placeholder="MIKA-WM-8KG (auto-generated if blank)"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"/>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
          <select required value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 bg-white">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subcategory</label>
          <input value={form.subcategory} onChange={e => set('subcategory', e.target.value)}
            placeholder="washing-machines"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"/>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (KES) *</label>
          <input required type="number" value={form.price} onChange={e => set('price', e.target.value)}
            placeholder="45000"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"/>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Compare Price (KES)</label>
          <input type="number" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)}
            placeholder="55000 (original/crossed-out price)"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"/>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock</label>
          <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"/>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Optional product description…"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 resize-none"/>
        </div>
      </div>

      <button type="submit" disabled={saving || !form.name || !form.price}
        className="w-full py-3.5 bg-[#6D28D9] text-white font-bold rounded-xl hover:bg-[#7C3AED] disabled:opacity-50 transition-all">
        {saving ? 'Saving…' : 'Add Product'}
      </button>
    </form>
  );
}
