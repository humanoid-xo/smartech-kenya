import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('M-Pesa Callback received:', JSON.stringify(body, null, 2));

    const { Body } = body;

    if (!Body || !Body.stkCallback) {
      return NextResponse.json({ error: 'Invalid callback' }, { status: 400 });
    }

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } =
      Body.stkCallback;

    // Find order by checkout ID
    const order = await prisma.order.findFirst({
      where: { mpesaCheckoutId: CheckoutRequestID },
      include: {
        user: true,
      },
    });

    if (!order) {
      console.error('Order not found for CheckoutRequestID:', CheckoutRequestID);
      return NextResponse.json(
        { message: 'Order not found but callback acknowledged' },
        { status: 200 }
      );
    }

    if (ResultCode === 0) {
      // Payment successful
      let mpesaReceiptNumber = '';
      let transactionDate = '';

      if (CallbackMetadata?.Item) {
        const items = CallbackMetadata.Item;
        const receiptItem = items.find((item: any) => item.Name === 'MpesaReceiptNumber');
        const dateItem = items.find((item: any) => item.Name === 'TransactionDate');

        if (receiptItem) mpesaReceiptNumber = receiptItem.Value;
        if (dateItem) transactionDate = dateItem.Value;
      }

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          status: 'processing',
        },
      });

      // Decrement stock for all items
      for (const item of order.items as any[]) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Send notifications
      try {
        await sendOrderConfirmation(
          order.user.email!,
          order.user.phone || undefined,
          {
            orderId: order.id,
            items: order.items as any[],
            total: order.total,
          }
        );
      } catch (notifError) {
        console.error('Notification error:', notifError);
        // Don't fail the callback if notification fails
      }

      console.log(`Order ${order.id} payment successful. Receipt: ${mpesaReceiptNumber}`);
    } else {
      // Payment failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'failed',
        },
      });

      console.log(`Order ${order.id} payment failed: ${ResultDesc}`);
    }

    return NextResponse.json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    // Return 200 even on error to prevent retries
    return NextResponse.json(
      { message: 'Callback acknowledged with errors' },
      { status: 200 }
    );
  }
}
