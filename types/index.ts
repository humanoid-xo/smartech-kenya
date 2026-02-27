/**
 * Smartech Kenya - Type Definitions
 * Production-ready TypeScript types for the entire application
 */

import { Prisma } from '@prisma/client';

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  image?: string | null;
  isSeller: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export enum Category {
  TECH = 'TECH',
  KITCHEN = 'KITCHEN',
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  category: Category;
  subcategory?: string | null;
  brand: string;
  stock: number;
  sku: string;
  images: string[];
  features?: Prisma.JsonValue;
  specifications?: Prisma.JsonValue;
  tags: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithReviews extends Product {
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ProductFilters {
  category?: Category;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  images: string[];
  productId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithUser extends Review {
  user: {
    name: string;
    image?: string | null;
  };
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  trackingNumber?: string | null;
  notes?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  user: {
    name: string;
    email: string;
  };
  payment?: Payment | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
  image?: string | null;
  orderId: string;
  productId: string;
}

export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  mpesaReceiptNumber?: string | null;
  mpesaTransactionId?: string | null;
  mpesaPhoneNumber?: string | null;
  transactionId?: string | null;
  failureReason?: string | null;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}

export interface MPesaSTKPushRequest {
  phone: string;
  amount: number;
  orderId: string;
  accountReference: string;
  transactionDesc: string;
}

export interface MPesaCallbackResponse {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

// ============================================================================
// CART & WISHLIST TYPES
// ============================================================================

export interface CartItem {
  id: string;
  quantity: number;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

export interface WishlistItemWithProduct extends WishlistItem {
  product: Product;
}

// ============================================================================
// ADDRESS TYPES
// ============================================================================

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
  errors?: Record<string, string[]>;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  isSeller?: boolean;
}

export interface CreateProductFormData {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: Category;
  subcategory?: string;
  brand: string;
  stock: number;
  images: string[];
  features?: Record<string, unknown>;
  specifications?: Record<string, unknown>;
  tags?: string[];
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: 'MPESA' | 'CARD';
  phone: string;
  notes?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
