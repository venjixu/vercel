import { Router } from 'express';
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
} from './payment';

export const paymentRouter = Router();

paymentRouter.get('/entitlement', (req, res) => {
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  const entitlement = verifyEntitlement(token);
  res.json({ active: !!entitlement, entitlement });
});

paymentRouter.post('/config', (_req, res) => {
  try { res.json({ keyId: publicRazorpayKey() }); }
  catch (e: any) { res.status(500).json({ error: e?.message || 'Payment configuration error' }); }
});

paymentRouter.post('/create-order', async (req, res) => {
  try {
    const planId = req.body?.planId as PlanId;
    if (!PLANS[planId]) return res.status(400).json({ error: 'Invalid plan' });
    const order = await createRazorpayOrder(planId);
    res.json({ keyId: publicRazorpayKey(), order, plan: PLANS[planId] });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unable to create order' });
  }
});

paymentRouter.post('/verify', async (req, res) => {
  try {
    const { planId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!PLANS[planId as PlanId] || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }
    if (!verifyCheckoutSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }
    const [order, payment] = await Promise.all([fetchRazorpayOrder(razorpay_order_id), fetchRazorpayPayment(razorpay_payment_id)]);
    const plan = PLANS[planId as PlanId];
    if (order.amount !== plan.amount * 100 || order.currency !== 'INR') return res.status(400).json({ error: 'Order amount/currency mismatch' });
    if (order.status !== 'paid' && payment.status !== 'captured') return res.status(400).json({ error: 'Payment has not been captured yet' });
    if (payment.order_id !== razorpay_order_id) return res.status(400).json({ error: 'Payment does not belong to this order' });
    const expiresAt = plan.durationDays ? Date.now() + plan.durationDays * 86400000 : null;
    const entitlement = { plan: planId as PlanId, expiresAt, orderId: razorpay_order_id, paymentId: razorpay_payment_id };
    res.json({ verified: true, token: issueEntitlement(entitlement), entitlement });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Payment verification failed' });
  }
});
