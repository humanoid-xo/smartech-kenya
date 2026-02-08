import twilio from 'twilio';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  console.log(`📧 Email notification: ${to} - ${subject}`);
  console.log('(Email temporarily disabled - SMS notifications active)');
  return Promise.resolve();
}

export async function sendSMS(to: string, body: string): Promise<void> {
  if (!twilioClient) {
    console.log(`📱 SMS would be sent to ${to}: ${body}`);
    console.log('(Twilio not configured)');
    return;
  }

  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body,
    });
    console.log(`✅ SMS sent to ${to}`);
  } catch (error) {
    console.error('SMS sending failed:', error);
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
    <h1>Order Confirmation - Smartech Kenya</h1>
    <p>Thank you for your order!</p>
    <h2>Order #${orderDetails.orderId}</h2>
    <p><strong>Total:</strong> KES ${orderDetails.total.toLocaleString()}</p>
    <h3>Items:</h3>
    <ul>
      ${orderDetails.items.map(item => `
        <li>${item.name} - Qty: ${item.quantity} - KES ${item.price.toLocaleString()}</li>
      `).join('')}
    </ul>
  `;

  await sendEmail(email, 'Order Confirmation', emailHtml);

  if (phone) {
    const smsBody = `Smartech Kenya: Order #${orderDetails.orderId} confirmed! Total: KES ${orderDetails.total.toLocaleString()}. Thank you!`;
    await sendSMS(phone, smsBody);
  }
}