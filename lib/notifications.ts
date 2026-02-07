import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function sendSMS(to: string, body: string): Promise<void> {
  if (!twilioClient) {
    console.warn('Twilio not configured, skipping SMS');
    return;
  }

  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body,
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
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
        <li>${item.name} - Quantity: ${item.quantity} - KES ${item.price.toLocaleString()}</li>
      `).join('')}
    </ul>
    <p>We'll notify you when your order is ready for delivery.</p>
  `;

  await sendEmail(email, 'Order Confirmation - Smartech Kenya', emailHtml);

  if (phone) {
    const smsBody = `Smartech Kenya: Your order #${orderDetails.orderId} has been confirmed. Total: KES ${orderDetails.total.toLocaleString()}. Thank you!`;
    await sendSMS(phone, smsBody);
  }
}
