/**
 * Application Constants
 */

export const APP_NAME = 'Smartech Kenya';
export const APP_DESCRIPTION = 'Kenya\'s Premier Marketplace for Tech & Kitchen Appliances';

export const CATEGORIES = {
  TECH: 'Technology & Electronics',
  KITCHEN: 'Kitchen Appliances',
} as const;

export const ORDER_STATUSES = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
} as const;

export const PAYMENT_METHODS = {
  MPESA: 'M-Pesa',
  CARD: 'Credit/Debit Card',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

export const PRICE_RANGES = [
  { label: 'Under KES 5,000', min: 0, max: 5000 },
  { label: 'KES 5,000 - 10,000', min: 5000, max: 10000 },
  { label: 'KES 10,000 - 25,000', min: 10000, max: 25000 },
  { label: 'KES 25,000 - 50,000', min: 25000, max: 50000 },
  { label: 'Over KES 50,000', min: 50000, max: 999999999 },
] as const;

export const KENYAN_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  // Add more as needed
] as const;
