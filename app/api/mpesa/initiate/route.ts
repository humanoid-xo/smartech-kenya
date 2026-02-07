import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { initiateSTKPush } from '@/lib/mpesa';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const paymentSchema = z.object({
  phone: z.string().regex(/^(254|0)\d{9}$/, 'Invalid phone number format'),
  amount: z.number().positive(),
  orderId: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = paymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { phone, amount, orderId } = validation.data;

    // Verify order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Order does not belong to you' },
        { status: 403 }
      );
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      );
    }

    // Initiate STK push
    const response = await initiateSTKPush(
      phone,
      amount,
      `Order-${orderId}`,
      'Payment for Smartech Kenya order'
    );

    // Update order with checkout ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        mpesaCheckoutId: response.CheckoutRequestID,
      },
    });

    return NextResponse.json({
      message: 'STK push initiated successfully',
      checkoutRequestId: response.CheckoutRequestID,
      merchantRequestId: response.MerchantRequestID,
    });
  } catch (error: any) {
    console.error('M-Pesa payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
