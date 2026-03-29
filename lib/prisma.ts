import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function makePrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    console.error('[Smartech] DATABASE_URL is not set — add it to Vercel environment variables.');
  }
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (e) {
    console.error('[Smartech] PrismaClient init failed:', e);
    return new PrismaClient();
  }
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
