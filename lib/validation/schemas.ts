/**
 * Zod Validation Schemas
 * Centralized validation for all API inputs
 */

import { z } from 'zod';
import { Category } from '@/types';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number').optional(),
  isSeller: z.boolean().optional(),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  category: z.nativeEnum(Category),
  subcategory: z.string().optional(),
  brand: z.string().min(2, 'Brand is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().min(3, 'SKU is required'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  features: z.record(z.any()).optional(),
  specifications: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Order schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, 'Order must have at least one item'),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string(),
    country: z.string().default('Kenya'),
  }),
  paymentMethod: z.enum(['MPESA', 'CARD']),
  notes: z.string().max(500).optional(),
});

// Payment schemas
export const mpesaPaymentSchema = z.object({
  phone: z.string().regex(/^254[0-9]{9}$/, 'Phone must be in format 254XXXXXXXXX'),
  amount: z.number().positive().min(1).max(150000),
  orderId: z.string(),
});

// Review schemas
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000).optional(),
  images: z.array(z.string().url()).max(5).optional(),
  productId: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type MPesaPaymentInput = z.infer<typeof mpesaPaymentSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
