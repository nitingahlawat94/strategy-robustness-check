# Backend setup (about 30 minutes, once your accounts exist)
The website needs these settings before sign-in and paid reports can work. Keep all provider secrets in their provider dashboards, never in public website code.
Menus in other companies' dashboards change, so if a label differs, check their current docs.

## 1. Database and sign-in (Supabase)
1. Create an account at supabase.com and a new project. Save the database password somewhere safe.
2. Open **SQL Editor**, paste all of `backend/schema.sql`, press **Run**.
3. **Authentication > URL Configuration**: set Site URL to your website link and add `YOUR-LINK/account.html` and `YOUR-LINK/tool.html` as redirect URLs.
4. **Authentication > Emails > Magic Link**: put `{{ .Token }}` in the message so the email contains the one-time sign-in code.
5. **Authentication > Sign In / Providers**: Google and Apple require their own OAuth client IDs and secrets. Enter those in Supabase, never in the website files.
6. **Settings > API**: copy the **Project URL** and the **anon public** key into `js/config.js` (`supabaseUrl`, `supabaseAnonKey`).
   The anon key is meant to be public. NEVER paste the `service_role` key anywhere in the website files.
7. Set the public contact email in `js/config.js` only after its domain mailbox or forwarding is live. `support@robustly.com` requires control of `robustly.com`, valid MX/mail routing, and a sender verified with your SMTP provider. Supabase sign-in email delivery is separate from the website contact address.
8. For an existing project, run `backend/migrations/profile-details.sql` once in the Supabase SQL Editor before deploying the account page. It adds optional full name and phone fields and lets a user edit only those fields on their own profile row. For a new project, `backend/schema.sql` includes them.
9. Upload the changed site files. The email-code form uses Supabase Auth; rate limits follow the SMTP provider configuration.

## 2. Reviews
Submitted reviews wait unapproved. In **Table Editor > reviews**, tick `approved` to publish one. Nothing is published until you do.

## 3. Certificates
1. Once, on your own computer: `node tools/keygen.js`. Paste the printed public key into `js/cert.js` (`PUB`). Keep `private-key.jwk` secret.
2. For each request: reproduce the person's file in the tool, confirm the Report ID and score match, then run `node tools/issue.js --rid=... --score=... --headline="..." --n=... --holder="Name"`.
3. Paste the SQL it prints into the SQL Editor. The certificate is now public and verifiable.

## 4. Payments (Razorpay), test mode first

The website is configured for one-time report purchases: Basic $7 (700 USD cents) and Pro $23 (2,300 USD cents). A purchase is bound to one report ID and one signed-in account. The browser never receives the Razorpay secret or Supabase service-role key.

1. Finish Razorpay account activation and enable USD/international payments if your account supports it. Use test mode first.
2. In Supabase SQL Editor, run `backend/schema.sql` on a new project, or run `backend/migrations/report-packages.sql` on the current project. Do not rerun the original schema over existing tables.
3. Deploy the `create-report-order`, `verify-report-payment`, and `razorpay-webhook` Edge Functions.
4. Set Edge Function secrets: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `BASIC_AMOUNT_MINOR=700`, `PRO_AMOUNT_MINOR=2300`, `PAYMENT_CURRENCY=USD`, plus the project's server-side Supabase keys. Never place any secret in `js/config.js`.
5. Configure Razorpay's webhook for `payment.captured` at `https://twytfskmktpupcbrxnxs.supabase.co/functions/v1/razorpay-webhook` with the same webhook secret.
6. Put the Razorpay **Key ID only** in `js/config.js`, set `paymentFunctionsReady:true`, build, and deploy the site.
7. Make test purchases for both tiers and verify each is attached to the matching account and report ID. Basic must show only its summary; Pro must show the full report and allow the certificate request. Only then enable live mode.

The payment integration is intentionally disabled in the website until these steps are complete.
