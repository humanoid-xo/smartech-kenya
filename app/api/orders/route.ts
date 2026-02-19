import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
      image: z.string(),
    })
  ),
  shippingAddress: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    county: z.string(),
  }),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { items, shippingAddress } = validation.data;

    // Verify stock availability
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.name}. Available: ${product?.stock || 0}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        items: items as any,
        total,
        paymentMethod: 'mpesa',
        shippingAddress: shippingAddress as any,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {
      userId: (session.user as any).id,
    };

    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
