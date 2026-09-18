import crypto from 'node:crypto';

export type PlanId = 'resume-pro' | 'job-hunter' | 'career-pack';

export const PLANS: Record<PlanId, { name: string; amount: number; durationDays: number | null }> = {
  'resume-pro': { name: 'Resume Pro', amount: 49, durationDays: null },
  'job-hunter': { name: 'Job Hunter', amount: 99, durationDays: 30 },
  'career-pack': { name: 'Career Pack', amount: 199, durationDays: 90 },
};

export function getPlan(planId: string): (typeof PLANS)[PlanId] | null {
  return Object.prototype.hasOwnProperty.call(PLANS, planId) ? PLANS[planId as PlanId] : null;
}

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function razorpayAuthHeader() {
  const keyId = required('RAZORPAY_KEY_ID');
  const keySecret = required('RAZORPAY_KEY_SECRET');
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
}

export function publicRazorpayKey() {
  return required('RAZORPAY_KEY_ID');
}

export async function createRazorpayOrder(planId: PlanId) {
  const plan = PLANS[planId];
  const receipt = `fai_${planId}_${Date.now()}`.slice(0, 40);
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: razorpayAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: plan.amount * 100,
      currency: 'INR',
      receipt,
      notes: { product: 'FresherAI', planId },
      partial_payment: false,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.description || 'Unable to create Razorpay order');
  }
  return data;
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const secret = required('RAZORPAY_KEY_SECRET');
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function fetchRazorpayOrder(orderId: string) {
  const response = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: razorpayAuthHeader() },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.description || 'Unable to fetch Razorpay order');
  return data;
}

export async function fetchRazorpayPayment(paymentId: string) {
  const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: razorpayAuthHeader() },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.description || 'Unable to fetch Razorpay payment');
  return data;
}

function b64url(input: string) {
  return Buffer.from(input).toString('base64url');
}

export type Entitlement = {
  plan: PlanId;
  issuedAt: number;
  expiresAt: number | null;
  orderId: string;
  paymentId: string;
};

export function issueEntitlement(input: Omit<Entitlement, 'issuedAt'>) {
  const payload: Entitlement = { ...input, issuedAt: Date.now() };
  const encoded = b64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', required('PAYMENT_TOKEN_SECRET')).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyEntitlement(token: string): Entitlement | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;
    const expected = crypto.createHmac('sha256', required('PAYMENT_TOKEN_SECRET')).update(encoded).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as Entitlement;
    if (!PLANS[payload.plan]) return null;
    if (payload.expiresAt && Date.now() >= payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}
