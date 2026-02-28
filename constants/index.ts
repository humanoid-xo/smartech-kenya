export const APP_NAME        = 'Smartech Kenya';
export const APP_DESCRIPTION = "Kenya's Premier Marketplace for Electronics & Home Appliances";
export const APP_URL         = process.env.NEXT_PUBLIC_APP_URL ?? '';

export const CATEGORIES = {
  SMARTPHONES:     'Smartphones & Tablets',
  LAPTOPS:         'Laptops & Computers',
  HOME_APPLIANCES: 'Home Appliances',
  KITCHEN:         'Kitchen Appliances',
  BEDROOM:         'Bedroom & Living',
  AUDIO_TV:        'Audio & Television',
  ELECTRICAL:      'Electrical & Lighting',
  SMART_HOME:      'Smart Home',
} as const;

export const ORDER_STATUSES = {
  PENDING:    'Pending',
  PROCESSING: 'Processing',
  SHIPPED:    'Shipped',
  DELIVERED:  'Delivered',
  CANCELLED:  'Cancelled',
  REFUNDED:   'Refunded',
} as const;

export const PAYMENT_METHODS = {
  MPESA: 'M-Pesa',
  CARD:  'Credit / Debit Card',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT:     100,
} as const;

export const PRICE_RANGES = [
  { label: 'Under KES 5,000',         min: 0,     max: 5_000      },
  { label: 'KES 5,000 – 10,000',      min: 5_000, max: 10_000     },
  { label: 'KES 10,000 – 25,000',     min: 10_000,max: 25_000     },
  { label: 'KES 25,000 – 50,000',     min: 25_000,max: 50_000     },
  { label: 'Over KES 50,000',         min: 50_000,max: 999_999_999},
] as const;

export const KENYAN_COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika',
  'Malindi','Kitale','Garissa','Kakamega',
] as const;

export const FREE_DELIVERY_THRESHOLD = 10_000; // KES
