type VercelRequest = { method?: string; body?: any; query: Record<string, string | string[] | undefined> };
type VercelResponse = { status: (code: number) => VercelResponse; json: (body: unknown) => VercelResponse };
import {
  PLANS,
  createRazorpayOrder,
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  issueEntitlement,
  publicRazorpayKey,
  verifyCheckoutSignature,
  verifyEntitlement,
  type PlanId,
} from '../lib/payment';

function methodError(res: VercelResponse) {
  res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') return methodError(res);

  try {
    if (req.method === 'GET') {
      const token = typeof req.query.token === 'string' ? req.query.token : '';
      const entitlement = verifyEntitlement(token);
      return res.status(200).json({ active: !!entitlement, entitlement });
    }

    const action = req.body?.action;

    if (action === 'config') {
      return res.status(200).json({ keyId: publicRazorpayKey() });
    }

    if (action === 'create-order') {
      const planId = req.body?.planId as PlanId;
      if (!PLANS[planId]) return res.status(400).json({ error: 'Invalid plan' });
      const order = await createRazorpayOrder(planId);
      return res.status(200).json({ keyId: publicRazorpayKey(), order, plan: PLANS[planId] });
    }

    if (action === 'verify') {
      const { planId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
      if (!PLANS[planId as PlanId] || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment verification fields' });
      }

      if (!verifyCheckoutSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      const [order, payment] = await Promise.all([
        fetchRazorpayOrder(razorpay_order_id),
        fetchRazorpayPayment(razorpay_payment_id),
      ]);

      const plan = PLANS[planId as PlanId];
      if (order.amount !== plan.amount * 100 || order.currency !== 'INR') {
        return res.status(400).json({ error: 'Order amount/currency does not match the selected plan' });
      }
      if (order.status !== 'paid' && payment.status !== 'captured') {
        return res.status(400).json({ error: 'Payment has not been captured yet' });
      }
      if (payment.order_id !== razorpay_order_id) {
        return res.status(400).json({ error: 'Payment does not belong to this order' });
      }

      const expiresAt = plan.durationDays ? Date.now() + plan.durationDays * 24 * 60 * 60 * 1000 : null;
      const entitlement = {
        plan: planId as PlanId,
        expiresAt,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      };
      const token = issueEntitlement(entitlement);
      return res.status(200).json({ verified: true, token, entitlement });
    }

    return res.status(400).json({ error: 'Unknown payment action' });
  } catch (error: any) {
    console.error('Razorpay API error:', error);
    return res.status(500).json({ error: error?.message || 'Payment service error' });
  }
}
