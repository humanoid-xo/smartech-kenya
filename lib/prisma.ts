import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function makePrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    console.error('[Smartech] ⚠  DATABASE_URL is not set — add it to your .env file');
  }
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
            ? process.env.DATABASE_URL.includes('connectTimeoutMS')
              ? process.env.DATABASE_URL
              : process.env.DATABASE_URL + (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'connectTimeoutMS=5000&socketTimeoutMS=5000'
            : undefined,
        },
      },
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
