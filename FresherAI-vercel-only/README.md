# FresherAI — Vercel-only Razorpay setup

This version is designed to deploy on Vercel without Supabase or another database.

## Plans
- ₹49 Resume Pro — one-time
- ₹99 Job Hunter — 30 days
- ₹199 Career Pack — 90 days

## Vercel environment variables

Add these in Vercel → Project → Settings → Environment Variables:

- `GEMINI_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `PAYMENT_TOKEN_SECRET` (use a long random secret, 32+ characters)
- `APP_URL` (your Vercel URL)

Never expose `RAZORPAY_KEY_SECRET` or `PAYMENT_TOKEN_SECRET` to the browser.

## Deploy

Import the project into Vercel. Vercel will run:

`npm run build`

The Vercel function is `api/payments.ts`.

The frontend sends payment actions to `/api/payments`, so it works with Vercel's serverless function routing.

## Razorpay flow

1. Browser asks `/api/payments` to create an order.
2. Server creates the Razorpay order using the secret key.
3. Razorpay Checkout opens in the browser.
4. Browser sends the Checkout response to `/api/payments` with `action: verify`.
5. Server verifies the signature and checks the order/payment amount, currency, status, and order ownership.
6. Server returns a signed premium entitlement token.
7. Browser stores the token locally and unlocks premium features.

## Important Vercel-only limitation

There is no database in this version. Premium entitlement is represented by a server-signed token stored in the user's browser.

That means:
- Access can be restored on the same browser after refresh.
- A user can lose access if local browser storage is cleared.
- The token is transferable if someone deliberately copies it.

For persistent account-based access across devices, add a database/auth provider later.

## Testing

Start with Razorpay Test Mode. Use Razorpay's test credentials and test payment flow before switching to live keys.

Do not treat a client-side success callback as proof of payment. The app unlocks premium only after the server-side verification endpoint succeeds.
