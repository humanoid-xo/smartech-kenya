// Verified Unsplash images — each slug has a photo that matches its label
// All photos are free for commercial use (Unsplash license)

export const CATEGORY_IMAGES: Record<string, string> = {
  // ── Tech ──────────────────────────────────────────────────────────────
  'smart-tvs':
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80&auto=format&fit=crop',
  'laptops':
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80&auto=format&fit=crop',
  'phones':
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80&auto=format&fit=crop',
  'audio':
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop',
  'cameras':
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80&auto=format&fit=crop',
  'gaming':
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=600&q=80&auto=format&fit=crop',
  'networking':
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80&auto=format&fit=crop',
  'accessories':
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80&auto=format&fit=crop',

  // ── Kitchen ────────────────────────────────────────────────────────────
  'fridges':
    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80&auto=format&fit=crop',
  'cookers':
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop',
  'built-in':
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80&auto=format&fit=crop',
  'washing-machines':
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80&auto=format&fit=crop',
  // Microwave — actual countertop microwave photo
  'microwaves':
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80&auto=format&fit=crop',
  // Air conditioner — wall-mounted split unit
  'air-conditioners':
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80&auto=format&fit=crop',
  // Small appliances — blender/kettle on counter
  'small-appliances':
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80&auto=format&fit=crop',
  // Water dispenser
  'water-dispensers':
    'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&q=80&auto=format&fit=crop',
}

export const HERO_BG =
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=85&auto=format&fit=crop'

export const HERO_GRID = [
  {
    src:   'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80&auto=format&fit=crop',
    label: 'Smart TVs',
    href:  '/products?category=TECH&subcategory=smart-tvs',
  },
  {
    src:   'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80&auto=format&fit=crop',
    label: 'Fridges',
    href:  '/products?category=KITCHEN&subcategory=fridges',
  },
  {
    src:   'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80&auto=format&fit=crop',
    label: 'Laptops',
    href:  '/products?category=TECH&subcategory=laptops',
  },
  {
    src:   'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80&auto=format&fit=crop',
    label: 'Built-in Kitchen',
    href:  '/products?category=KITCHEN&subcategory=built-in',
  },
]

export const PROMO_IMAGES = {
  builtIn:
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=80&auto=format&fit=crop',
  energySaving:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format&fit=crop',
  seller:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80&auto=format&fit=crop',
}
