# FresherAI production monetization

This version adds account-based premium entitlements backed by Supabase, while keeping Razorpay payment verification server-side.

## 1. Supabase

Create a Supabase project and run `supabase-schema.sql` in its SQL editor.

Enable Email/Password authentication in Authentication > Providers.

Set these environment variables in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `PAYMENT_TOKEN_SECRET`
- `GEMINI_API_KEY`
- `APP_URL`

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, or `PAYMENT_TOKEN_SECRET` to the browser.

## 2. User flow

1. User creates/signs into a FresherAI account.
2. User selects ₹49 / ₹99 / ₹199.
3. The browser sends the Supabase access token to the Vercel payment API.
4. The API verifies the user, creates the Razorpay order, and records the user ID in Razorpay order notes.
5. Razorpay Checkout returns payment identifiers.
6. The API validates the Razorpay HMAC signature, fetches the order/payment from Razorpay, checks amount/currency/order ownership, then writes the entitlement to Supabase.
7. Premium access is read from the authenticated user's database entitlement, not from browser-only state.

## 3. Production note

The app still keeps a signed entitlement token for immediate UI updates, but the authoritative entitlement is the Supabase `entitlements` table. This means a paid plan can be recovered after signing in on another browser/device.

## 4. Deploy

Push this project to GitHub, import it into Vercel, and add the variables above. Run the Supabase SQL before testing checkout. Use Razorpay Test Mode first, then replace test credentials with live credentials only after the complete verification flow has been tested.
