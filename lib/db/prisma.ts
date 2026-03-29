import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Return the actual PrismaClient — never wrap it.
// Wrapping with getters or Proxy causes 'this' binding to break
// when methods like findMany() are called in Next.js server components.
export const prisma: PrismaClient =
  globalThis.__prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
