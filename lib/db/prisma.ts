import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient({ log: ['error'] });
  }
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({ log: ['error', 'warn'] });
  }
  return globalThis.__prisma;
}

// Lazy singleton — only created when first accessed, not at module parse time
let _client: PrismaClient | null = null;

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!_client) _client = getPrismaClient();
    return (_client as any)[prop];
  },
});

export default prisma;
