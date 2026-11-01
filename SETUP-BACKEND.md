# Backend setup (about 30 minutes, once your accounts exist)
Nothing here is required for the site to work. Everything stays switched off until you fill in `js/config.js`.
Menus in other companies' dashboards change, so if a label differs, check their current docs.

## 1. Database and sign-in (Supabase, free plan)
1. Create an account at supabase.com and a new project. Save the database password somewhere safe.
2. Open **SQL Editor**, paste all of `backend/schema.sql`, press **Run**.
3. **Authentication > URL Configuration**: set Site URL to your website link and add `YOUR-LINK/account.html` as a redirect URL.
4. **Settings > API**: copy the **Project URL** and the **anon public** key into `js/config.js` (`supabaseUrl`, `supabaseAnonKey`).
   The anon key is meant to be public. NEVER paste the `service_role` key anywhere in the website files.
5. Upload the changed `js/config.js` to GitHub. Accounts, saved reports, the waitlist and reviews now work.
6. Supabase's built-in email sender is limited to a few emails per hour. Before a big launch, add your own SMTP sender under Authentication settings.

## 2. Reviews
Submitted reviews wait unapproved. In **Table Editor > reviews**, tick `approved` to publish one. Nothing is published until you do.

## 3. Certificates
1. Once, on your own computer: `node tools/keygen.js`. Paste the printed public key into `js/cert.js` (`PUB`). Keep `private-key.jwk` secret.
2. For each request: reproduce the person's file in the tool, confirm the Report ID and score match, then run `node tools/issue.js --rid=... --score=... --headline="..." --n=... --holder="Name"`.
3. Paste the SQL it prints into the SQL Editor. The certificate is now public and verifiable.

## 4. Payments (Razorpay), test mode first
1. Create a Razorpay account and complete verification (this can take days, so start now).
2. Create a **Payment Page** or **Payment Link** for Pro. Put its URL in `js/config.js` as `paymentUrl`.
3. Install the Supabase CLI, then run `supabase login`, `supabase link --project-ref YOUR-REF`.
4. Set secrets: `supabase secrets set RAZORPAY_WEBHOOK_SECRET=choose-a-long-random-string PRO_AMOUNT_PAISE=49900` (use your price in paise).
5. Deploy: `supabase functions deploy razorpay-webhook --no-verify-jwt`
6. In Razorpay, add a webhook: URL `https://YOUR-REF.supabase.co/functions/v1/razorpay-webhook`, the same secret, event `payment.captured`.
7. Make a test-mode payment with the same email as a test account. The account page should show Pro within a minute.
8. Only then switch Razorpay to live mode.
