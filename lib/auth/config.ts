import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma }          from '@/lib/db/prisma';
import { comparePassword } from '@/lib/auth/password';
import { loginSchema }     from '@/lib/validation/schemas';

export const authOptions: NextAuthOptions = {
  // NO adapter — we use JWT sessions, adapter is only for database sessions
  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error:  '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const result = loginSchema.safeParse(credentials);
        if (!result.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.hashedPassword) return null;

        const isValid = await comparePassword(credentials.password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id:       user.id,
          email:    user.email,
          name:     user.name,
          image:    user.image ?? null,
          isSeller: user.isSeller,
          isAdmin:  user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id       = user.id;
        token.isSeller = (user as any).isSeller;
        token.isAdmin  = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id       = token.id;
        (session.user as any).isSeller = token.isSeller;
        (session.user as any).isAdmin  = token.isAdmin;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
