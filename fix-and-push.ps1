# ============================================================
# Smartech Kenya - Fix All Bugs & Push to GitHub
# Run this from: C:\Users\User\Desktop\smartech-kenya-main\smartech-kenya-main
# ============================================================

Write-Host "`n=====================================================" -ForegroundColor Cyan
Write-Host "  Smartech Kenya - Bug Fixer & GitHub Push Script" -ForegroundColor Cyan
Write-Host "=====================================================`n" -ForegroundColor Cyan

# ── BUG 1 & 2: lib/prisma.ts ──────────────────────────────
# Problem: Only had default export. lib/auth.ts and product routes
#          import it as a named export { prisma } — causing TypeScript errors.
# Fix:     Export both named and default.
# ─────────────────────────────────────────────────────────────
Write-Host "[1/8] Fixing lib/prisma.ts (missing named export)..." -ForegroundColor Yellow

Set-Content -Path "lib\prisma.ts" -Encoding UTF8 -Value @'
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Export both named and default so all import styles work
export { prisma };
export default prisma;
'@

Write-Host "    ✓ lib/prisma.ts fixed" -ForegroundColor Green

# ── BUGS 3: app/api/products/[id]/route.ts ────────────────
# Problem 1: File was corrupted — it literally contained shell heredoc
#            commands (cat > ... << 'EOF') instead of TypeScript.
# Problem 2: The original TypeScript error: Parameter 'sum' implicitly
#            has an 'any' type. Fixed with (sum: number, r).
# ─────────────────────────────────────────────────────────────
Write-Host "[2/8] Fixing app/api/products/[id]/route.ts (corrupted file + sum type error)..." -ForegroundColor Yellow

$idRouteDir = "app\api\products\[id]"
if (-not (Test-Path $idRouteDir)) { New-Item -ItemType Directory -Path $idRouteDir -Force | Out-Null }

Set-Content -LiteralPath "app\api\products\[id]\route.ts" -Encoding UTF8 -Value @'
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  features: z.record(z.any()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // FIX: Added (sum: number) type annotation to resolve implicit 'any' error
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum: number, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    return NextResponse.json({
      ...product,
      avgRating,
      reviewCount: product.reviews.length,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.sellerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.sellerId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
'@

Write-Host "    ✓ app/api/products/[id]/route.ts fixed" -ForegroundColor Green

# ── BUG 4: app/api/products/route.ts ──────────────────────
# Problem: File was corrupted with shell heredoc commands at top/bottom.
# Fix:     Write clean TypeScript only.
# ─────────────────────────────────────────────────────────────
Write-Host "[3/8] Fixing app/api/products/route.ts (corrupted file)..." -ForegroundColor Yellow

Set-Content -Path "app\api\products\route.ts" -Encoding UTF8 -Value @'
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['tech', 'kitchen'], { required_error: 'Category is required' }),
  brand: z.string().min(1, 'Brand is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  features: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where: any = {};

    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
            },
          },
          reviews: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    // FIX: Added (sum: number) type annotation to resolve implicit 'any' error
    const productsWithRatings = products.map((product) => ({
      ...product,
      avgRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum: number, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
    }));

    return NextResponse.json({
      products: productsWithRatings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isSeller) {
      return NextResponse.json(
        { error: 'Unauthorized - Seller access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        sellerId: (session.user as any).id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
'@

Write-Host "    ✓ app/api/products/route.ts fixed" -ForegroundColor Green

# ── BUG 5: lib/auth.ts ────────────────────────────────────
# Problem: File was corrupted with shell heredoc commands at top/bottom.
# Fix:     Write clean TypeScript only.
# ─────────────────────────────────────────────────────────────
Write-Host "[4/8] Fixing lib/auth.ts (corrupted file)..." -ForegroundColor Yellow

Set-Content -Path "lib\auth.ts" -Encoding UTF8 -Value @'
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isSeller: user.isSeller,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isSeller = (user as any).isSeller;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isSeller = token.isSeller;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
'@

Write-Host "    ✓ lib/auth.ts fixed" -ForegroundColor Green

# ── BUG 6: lib/notifications.ts ───────────────────────────
# Problem: File was corrupted with shell heredoc commands at top/bottom.
#          Also had garbled UTF-8 emoji characters.
# Fix:     Write clean TypeScript with proper characters.
# ─────────────────────────────────────────────────────────────
Write-Host "[5/8] Fixing lib/notifications.ts (corrupted file + broken emoji)..." -ForegroundColor Yellow

Set-Content -Path "lib\notifications.ts" -Encoding UTF8 -Value @'
import twilio from 'twilio';
import nodemailer from 'nodemailer';

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  if (!process.env.EMAIL_SERVER_USER) {
    console.log(`[Email] Would send to ${to}: ${subject} (email not configured)`);
    return;
  }

  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('[Email] Failed to send:', error);
  }
}

export async function sendSMS(to: string, body: string): Promise<void> {
  if (!twilioClient) {
    console.log(`[SMS] Would send to ${to}: ${body} (Twilio not configured)`);
    return;
  }

  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body,
    });
    console.log(`[SMS] Sent to ${to}`);
  } catch (error) {
    console.error('[SMS] Failed to send:', error);
  }
}

export async function sendOrderConfirmation(
  email: string,
  phone: string | undefined,
  orderDetails: {
    orderId: string;
    items: any[];
    total: number;
  }
): Promise<void> {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #006400;">Order Confirmation - Smartech Kenya</h1>
      <p>Thank you for your order!</p>
      <h2>Order #${orderDetails.orderId}</h2>
      <p><strong>Total:</strong> KES ${orderDetails.total.toLocaleString()}</p>
      <h3>Items:</h3>
      <ul>
        ${orderDetails.items
          .map(
            (item: any) =>
              `<li>${item.name} - Qty: ${item.quantity} - KES ${item.price.toLocaleString()}</li>`
          )
          .join('')}
      </ul>
      <p>We will notify you when your order is ready for delivery.</p>
      <p style="color: #666;">Smartech Kenya Team</p>
    </div>
  `;

  await sendEmail(email, 'Order Confirmation - Smartech Kenya', emailHtml);

  if (phone) {
    const smsBody = `Smartech Kenya: Order #${orderDetails.orderId} confirmed! Total: KES ${orderDetails.total.toLocaleString()}. Thank you!`;
    await sendSMS(phone, smsBody);
  }
}
'@

Write-Host "    ✓ lib/notifications.ts fixed" -ForegroundColor Green

# ── BUG 7: app/page.tsx ───────────────────────────────────
# Problem: Garbled UTF-8 characters — â†' should be →
# Fix:     Replace broken characters with correct Unicode.
# ─────────────────────────────────────────────────────────────
Write-Host "[6/8] Fixing app/page.tsx (garbled arrow character)..." -ForegroundColor Yellow

$pageContent = Get-Content -Path "app\page.tsx" -Raw -Encoding UTF8
$pageContent = $pageContent -replace 'View All â†'', 'View All →'
Set-Content -Path "app\page.tsx" -Value $pageContent -Encoding UTF8

Write-Host "    ✓ app/page.tsx fixed" -ForegroundColor Green

# ── BUG 8: components/Footer.tsx ──────────────────────────
# Problem: Garbled UTF-8 — Â© should be ©, ðŸ‡°ðŸ‡ª should be 🇰🇪
# Fix:     Replace broken characters with correct Unicode.
# ─────────────────────────────────────────────────────────────
Write-Host "[7/8] Fixing components/Footer.tsx (garbled copyright + flag emoji)..." -ForegroundColor Yellow

$footerContent = Get-Content -Path "components\Footer.tsx" -Raw -Encoding UTF8
$footerContent = $footerContent -replace 'Â©', '©'
$footerContent = $footerContent -replace 'ðŸ‡°ðŸ‡ª', '🇰🇪'
Set-Content -Path "components\Footer.tsx" -Value $footerContent -Encoding UTF8

Write-Host "    ✓ components/Footer.tsx fixed" -ForegroundColor Green

# ── BUG 9: components/ProductCard.tsx ─────────────────────
# Problem: Garbled UTF-8 — â€¢ should be •
# Fix:     Replace broken character with correct Unicode.
# ─────────────────────────────────────────────────────────────
Write-Host "[8/8] Fixing components/ProductCard.tsx (garbled bullet character)..." -ForegroundColor Yellow

$cardContent = Get-Content -Path "components\ProductCard.tsx" -Raw -Encoding UTF8
$cardContent = $cardContent -replace 'â€¢', '•'
Set-Content -Path "components\ProductCard.tsx" -Value $cardContent -Encoding UTF8

Write-Host "    ✓ components/ProductCard.tsx fixed" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════
# GIT: Stage, Commit, Push
# ═══════════════════════════════════════════════════════════
Write-Host "`n----- Pushing to GitHub -----`n" -ForegroundColor Cyan

git add `
  "lib/prisma.ts" `
  "app/api/products/[id]/route.ts" `
  "app/api/products/route.ts" `
  "lib/auth.ts" `
  "lib/notifications.ts" `
  "app/page.tsx" `
  "components/Footer.tsx" `
  "components/ProductCard.tsx"

git commit -m "fix: resolve all TypeScript build errors and file corruption

- lib/prisma.ts: add named export { prisma } alongside default export
  so both import styles work (fixes auth.ts and product routes)
- app/api/products/[id]/route.ts: remove shell heredoc corruption,
  fix implicit 'any' type on reduce() sum parameter
- app/api/products/route.ts: remove shell heredoc corruption,
  add sum:number type annotation on reduce()
- lib/auth.ts: remove shell heredoc corruption
- lib/notifications.ts: remove shell heredoc corruption,
  restore real nodemailer email sending, fix garbled emoji
- app/page.tsx: fix garbled UTF-8 arrow character (â†' -> ->)
- components/Footer.tsx: fix garbled copyright symbol and flag emoji
- components/ProductCard.tsx: fix garbled bullet point character"

git push origin main

if ($LASTEXITCODE -eq 0) {
  Write-Host "`n=====================================================" -ForegroundColor Green
  Write-Host "  All bugs fixed and pushed successfully!" -ForegroundColor Green
  Write-Host "  Vercel will now redeploy automatically." -ForegroundColor Green
  Write-Host "=====================================================" -ForegroundColor Green
} else {
  Write-Host "`n[!] Git push failed. Try running: git push origin main" -ForegroundColor Red
  Write-Host "    If your branch is not 'main', replace with your branch name." -ForegroundColor Red
}