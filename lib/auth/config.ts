// Auth via NextAuth is disabled — admin uses ADMIN_SECRET, storefront is read-only.
// This file is kept as a stub so existing imports don't break at build time.
export const authOptions: any = {
  providers: [],
  session:   { strategy: 'jwt' },
  secret:    process.env.NEXTAUTH_SECRET,
};
