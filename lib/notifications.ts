import twilio from 'twilio';
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  console.log('Email to ' + to + ': ' + subject);
}
export async function sendSMS(to: string, body: string): Promise<void> {
  if (!twilioClient) { console.log('SMS to ' + to + ': ' + body); return; }
  try { await twilioClient.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to, body }); } catch (error) { console.error('SMS failed:', error); }
}
export async function sendOrderConfirmation(email: string, phone: string | undefined, orderDetails: { orderId: string; items: any[]; total: number }): Promise<void> {
  const html = '<h1>Order #' + orderDetails.orderId + ' Confirmed</h1><p>Total: KES ' + orderDetails.total.toLocaleString() + '</p>';
  await sendEmail(email, 'Order Confirmation - Smartech Kenya', html);
  if (phone) await sendSMS(phone, 'Smartech Kenya: Order #' + orderDetails.orderId + ' confirmed! Total: KES ' + orderDetails.total.toLocaleString());
}
