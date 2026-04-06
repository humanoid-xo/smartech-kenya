/**
 * lib/cloudinary.ts
 * Single source of truth for all Cloudinary operations.
 * Products are stored as images with context metadata — no database needed.
 *
 * Context format:  key=value|key=value  (| and = inside values are backslash-escaped)
 * Public ID:       smartech-products/{SKU_SAFE}
 */

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME!;
const KEY   = process.env.CLOUDINARY_API_KEY!;
const SEC   = process.env.CLOUDINARY_API_SECRET!;

/* ── Types ─────────────────────────────────────────────────────────────────── */
export interface CldProduct {
  id:            string;   // public_id  e.g. "smartech-products/MIKA_WM_8KG"
  sku:           string;
  name:          string;
  brand:         string;
  category:      string;
  subcategory?:  string;
  price:         number;
  comparePrice?: number;
  stock:         number;
  description?:  string;
  images:        string[];
  isActive:      boolean;
  isFeatured:    boolean;
  slug:          string;
  createdAt:     string;
  avgRating:     number;
  reviewCount:   number;
}

/* ── Internal helpers ───────────────────────────────────────────────────────── */
function b64auth() {
  return 'Basic ' + Buffer.from(`${KEY}:${SEC}`).toString('base64');
}

async function sha1(str: string): Promise<string> {
  const raw = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(raw)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function skuToPublicId(sku: string) {
  return `smartech-products/${sku.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

function escVal(v: string | number | boolean) {
  return String(v).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/=/g, '\\=').replace(/\n/g, ' ');
}

function buildContext(fields: Partial<CldProduct>): string {
  const pairs: string[] = [];
  const add = (k: string, v: string | number | boolean | undefined | null) => {
    if (v != null && v !== '') pairs.push(`${k}=${escVal(v)}`);
  };
  add('name',         fields.name);
  add('brand',        fields.brand);
  add('category',     fields.category);
  add('subcategory',  fields.subcategory);
  add('price',        fields.price);
  add('comparePrice', fields.comparePrice);
  add('stock',        fields.stock);
  add('description',  fields.description);
  add('isActive',     fields.isActive);
  add('isFeatured',   fields.isFeatured);
  add('slug',         fields.slug);
  add('createdAt',    fields.createdAt);
  return pairs.join('|');
}

function parseResource(r: any): CldProduct {
  const c   = r.context?.custom ?? {};
  const pid = r.public_id as string;
  const sku = pid.replace('smartech-products/', '').replace(/_/g, '-');
  return {
    id:           pid,
    sku:          c.sku       ?? sku,
    name:         c.name      ?? sku,
    brand:        c.brand     ?? '',
    category:     c.category  ?? 'OTHER',
    subcategory:  c.subcategory || undefined,
    price:        parseFloat(c.price ?? '0'),
    comparePrice: c.comparePrice ? parseFloat(c.comparePrice) : undefined,
    stock:        parseInt(c.stock  ?? '1'),
    description:  c.description || undefined,
    images:       [r.secure_url],
    isActive:     c.isActive !== 'false',
    isFeatured:   c.isFeatured === 'true',
    slug:         c.slug ?? sku.toLowerCase(),
    createdAt:    c.createdAt ?? r.created_at ?? new Date().toISOString(),
    avgRating:    0,
    reviewCount:  0,
  };
}

/* ── Public API ─────────────────────────────────────────────────────────────── */

/** List all active products (fetches from Cloudinary Search API). */
export async function listProducts(opts?: {
  category?: string;
  brand?:    string;
  featured?: boolean;
  search?:   string;
  limit?:    number;
}): Promise<CldProduct[]> {
  try {
    const body = {
      expression:  'folder:smartech-products',
      with_field:  ['context'],
      max_results: opts?.limit ?? 500,
      sort_by:     [{ created_at: 'desc' }],
    };
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`,
      { method: 'POST', headers: { Authorization: b64auth(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    if (!res.ok) return [];
    const data = await res.json();

    let products: CldProduct[] = (data.resources ?? []).map(parseResource).filter((p: CldProduct) => p.isActive);

    if (opts?.featured)  products = products.filter(p => p.isFeatured);
    if (opts?.category)  products = products.filter(p => p.category === opts.category);
    if (opts?.brand)     products = products.filter(p => p.brand.toLowerCase() === opts.brand!.toLowerCase());
    if (opts?.search) {
      const q = opts.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)  || p.description?.toLowerCase().includes(q)
      );
    }
    return products;
  } catch { return []; }
}

/** Get a single product by SKU. */
export async function getProductBySku(sku: string): Promise<CldProduct | null> {
  try {
    const pid = skuToPublicId(sku);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload/${pid}?context=true`,
      { headers: { Authorization: b64auth() } }
    );
    if (!res.ok) return null;
    return parseResource(await res.json());
  } catch { return null; }
}

/** Get a product by slug (searches all products for matching slug). */
export async function getProductBySlug(slug: string): Promise<CldProduct | null> {
  // slug is {name-parts}-{sku_lowercased}, try SKU first
  const parts = slug.split('-');
  for (let i = parts.length - 1; i >= Math.max(0, parts.length - 4); i--) {
    const candidate = parts.slice(i).join('-').toUpperCase();
    const p = await getProductBySku(candidate);
    if (p) return p;
  }
  // Fallback: list all and match slug field
  const all = await listProducts();
  return all.find(p => p.slug === slug) ?? null;
}

/**
 * Create a new product — uploads image + sets context metadata.
 * Pass imageBase64 = '' to create a product without an image for now.
 */
export async function createProduct(
  imageBase64: string,
  fields: Omit<CldProduct, 'id' | 'images' | 'avgRating' | 'reviewCount'>
): Promise<CldProduct> {
  const pid = skuToPublicId(fields.sku);
  const ctx = buildContext({ ...fields });
  const ts  = Math.floor(Date.now() / 1000);

  if (imageBase64) {
    // Sign: context, overwrite, public_id, timestamp (alphabetical)
    const sigStr = `context=${ctx}&overwrite=true&public_id=${pid}&timestamp=${ts}${SEC}`;
    const sig    = await sha1(sigStr);
    const form   = new URLSearchParams({
      file: imageBase64, public_id: pid, overwrite: 'true',
      context: ctx, api_key: KEY, timestamp: String(ts), signature: sig,
    });
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Cloudinary upload failed: ${await res.text()}`);
    return parseResource(await res.json());
  } else {
    // Upload a placeholder pixel so the resource exists, then update context
    const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const sigStr = `context=${ctx}&overwrite=true&public_id=${pid}&timestamp=${ts}${SEC}`;
    const sig    = await sha1(sigStr);
    const form   = new URLSearchParams({
      file: placeholder, public_id: pid, overwrite: 'true',
      context: ctx, api_key: KEY, timestamp: String(ts), signature: sig,
    });
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Cloudinary create failed: ${await res.text()}`);
    return parseResource(await res.json());
  }
}

/**
 * Update just the image of an existing product (preserves existing context).
 */
export async function updateProductImage(imageBase64: string, sku: string): Promise<string> {
  const pid    = skuToPublicId(sku);
  const ts     = Math.floor(Date.now() / 1000);
  const sigStr = `overwrite=true&public_id=${pid}&timestamp=${ts}${SEC}`;
  const sig    = await sha1(sigStr);
  const form   = new URLSearchParams({
    file: imageBase64, public_id: pid, overwrite: 'true',
    api_key: KEY, timestamp: String(ts), signature: sig,
  });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.status}`);
  return (await res.json()).secure_url as string;
}

/**
 * Update context (metadata) of an existing product without touching the image.
 * Uses Cloudinary Admin API with Basic auth (no signature needed).
 */
export async function updateProductContext(sku: string, fields: Partial<CldProduct>): Promise<void> {
  const pid = skuToPublicId(sku);
  const ctx = buildContext(fields);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload/context`,
    {
      method:  'POST',
      headers: { Authorization: b64auth(), 'Content-Type': 'application/json' },
      body:    JSON.stringify({ context: ctx, public_ids: [pid], type: 'upload' }),
    }
  );
  if (!res.ok) throw new Error(`Context update failed: ${res.status}`);
}

/** List all products including inactive (for admin). */
export async function listAllProducts(): Promise<CldProduct[]> {
  try {
    const body = {
      expression:  'folder:smartech-products',
      with_field:  ['context'],
      max_results: 500,
      sort_by:     [{ created_at: 'desc' }],
    };
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`,
      { method: 'POST', headers: { Authorization: b64auth(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.resources ?? []).map(parseResource);
  } catch { return []; }
}
