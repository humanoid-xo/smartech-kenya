import NextAuth   from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// Prevent Next.js from trying to statically generate this route at build time
export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
