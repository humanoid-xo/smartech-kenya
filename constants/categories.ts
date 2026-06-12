/**
 * SINGLE SOURCE OF TRUTH for categories.
 * Used by: Header nav, ProductFilters, ProductList, AddProduct form, Footer.
 *
 * The `value` field is what gets stored in Cloudinary context as `category`.
 * Keep these values in sync with what the admin posts when adding products.
 */

export interface SubCategory {
  name:  string;
  slug:  string;
}

export interface CategoryDef {
  label:         string;          // display name
  value:         string;          // stored in Cloudinary context
  subcategories: SubCategory[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    label: 'Home Appliances',
    value: 'KITCHEN',
    subcategories: [
      { name: 'Fridges & Freezers',   slug: 'fridges'            },
      { name: 'Washing Machines',     slug: 'washing-machines'   },
      { name: 'Cookers & Ovens',      slug: 'cookers'            },
      { name: 'Built-in Appliances',  slug: 'built-in'           },
      { name: 'Microwaves',           slug: 'microwaves'         },
      { name: 'Water Dispensers',     slug: 'water-dispensers'   },
      { name: 'Small Appliances',     slug: 'small-appliances'   },
      { name: 'Air Conditioners',     slug: 'air-conditioners'   },
    ],
  },
  {
    label: 'Smartphones & Tablets',
    value: 'SMARTPHONES',
    subcategories: [
      { name: 'Smartphones',  slug: 'smartphones'  },
      { name: 'Tablets',      slug: 'tablets'      },
      { name: 'Accessories',  slug: 'accessories'  },
    ],
  },
  {
    label: 'Laptops & Computers',
    value: 'LAPTOPS',
    subcategories: [
      { name: 'Laptops',    slug: 'laptops'   },
      { name: 'Desktops',   slug: 'desktops'  },
      { name: 'Monitors',   slug: 'monitors'  },
      { name: 'Accessories',slug: 'accessories'},
    ],
  },
  {
    label: 'Audio & TVs',
    value: 'AUDIO_TV',
    subcategories: [
      { name: 'Smart TVs',   slug: 'smart-tvs'  },
      { name: 'Soundbars',   slug: 'soundbars'  },
      { name: 'Speakers',    slug: 'speakers'   },
      { name: 'Headphones',  slug: 'headphones' },
    ],
  },
  {
    label: 'Smart Home & Security',
    value: 'SMART_HOME',
    subcategories: [
      { name: 'CCTV & Cameras', slug: 'cctv'        },
      { name: 'Routers & WiFi', slug: 'networking'  },
      { name: 'Smart Plugs',    slug: 'smart-plugs' },
    ],
  },
  {
    label: 'Electrical',
    value: 'ELECTRICAL',
    subcategories: [
      { name: 'Lighting',     slug: 'lighting'  },
      { name: 'Solar',        slug: 'solar'     },
      { name: 'Cables',       slug: 'cables'    },
    ],
  },
];

/** Flat list for dropdowns (admin, filters, etc.) */
export const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ value: c.value, label: c.label }));

/** Look up a category label by value */
export function getCategoryLabel(value: string): string {
  return CATEGORIES.find(c => c.value === value)?.label ?? value;
}

/** Look up subcategories for a given category value */
export function getSubcategories(categoryValue: string): SubCategory[] {
  return CATEGORIES.find(c => c.value === categoryValue)?.subcategories ?? [];
}

export const POPULAR_BRANDS = [
  'Mika', 'Hisense', 'Samsung', 'LG', 'Ramtons',
  'HP', 'Von Hotpoint', 'Beko', 'Haier', 'TCL',
  'Infinix', 'Tecno', 'Sony', 'Bruhm', 'Vitron',
];
