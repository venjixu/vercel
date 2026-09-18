# FresherAI monetization + Razorpay integration

## Pricing
- Resume Pro — ₹49, one-time
- Job Hunter — ₹99, 30 days
- Career Pack — ₹199, 90 days

## Payment flow
1. Browser asks `/api/payments/create-order` for an order using a plan ID.
2. Server maps the plan ID to the fixed price; the browser never supplies the amount.
3. Razorpay Standard Checkout opens with the server-created order.
4. Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
5. `/api/payments/verify` verifies the HMAC signature and then fetches the order/payment from Razorpay to confirm amount, currency, order relationship, and capture state.
6. The server issues a signed entitlement token. The browser stores that token and unlocks premium UI.

Razorpay recommends creating orders server-side and validating the checkout signature. Keep `RAZORPAY_KEY_SECRET` server-side only. See the official docs for the Standard Checkout/Orders flow and security checklist.

## Environment variables
Copy `.env.example` to `.env` locally. On Vercel, add the same variables in Project Settings → Environment Variables.

Required:
- `GEMINI_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `PAYMENT_TOKEN_SECRET`

`RAZORPAY_KEY_ID` is safe to send to the browser as the public checkout key. `RAZORPAY_KEY_SECRET` and `PAYMENT_TOKEN_SECRET` must never be exposed to client code.

## Vercel
- Frontend is built with Vite into `dist/`.
- `api/payments.ts` is the Vercel serverless payment API.
- The existing Express server continues to support local development and mounts the same payment routes.

## Important production limitation
This MVP has no user account/database layer. The signed entitlement token protects the verification result from casual client-side editing, but the app's current resume/cover-letter tools are primarily browser-side features. For stronger production enforcement, add user authentication + a database entitlement record and check that entitlement on every premium AI/API operation.

Use Razorpay Test Mode first. Configure webhooks for asynchronous payment reconciliation before going live.
