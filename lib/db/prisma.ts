import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Simple lazy singleton - no Proxy, no module-level instantiation
export function getPrisma(): PrismaClient {
  if (globalThis.__prisma) return globalThis.__prisma;
  globalThis.__prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
  return globalThis.__prisma;
}

// Named export for direct use in route handlers
export const prisma = {
  get product()   { return getPrisma().product;   },
  get user()      { return getPrisma().user;       },
  get review()    { return getPrisma().review;     },
  get order()     { return getPrisma().order;      },
  get orderItem() { return getPrisma().orderItem;  },
  get cartItem()  { return getPrisma().cartItem;   },
  get wishlistItem() { return getPrisma().wishlistItem; },
  get address()   { return getPrisma().address;    },
  get account()   { return getPrisma().account;    },
  get session()   { return getPrisma().session;    },
  $disconnect()   { return getPrisma().$disconnect(); },
  $connect()      { return getPrisma().$connect();    },
  $transaction(args: any) { return getPrisma().$transaction(args); },
};

export default prisma;
