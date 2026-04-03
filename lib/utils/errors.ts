/**
 * Error Handling Utilities
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        errors: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'A record with this value already exists',
        },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'Record not found',
        },
        { status: 404 }
      );
    }
  }

  // Custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Default error
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
    },
    { status: 500 }
  );
}
