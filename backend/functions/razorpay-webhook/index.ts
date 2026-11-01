// Supabase Edge Function. Razorpay calls this after a payment. It verifies the signature, then unlocks Pro for 30 days.
// Deploy with: supabase functions deploy razorpay-webhook --no-verify-jwt
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { hmacHex, same, proFromEvent } from './webhook.mjs';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('POST only', { status: 405 });
  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
  if (!secret) return new Response('server not configured', { status: 500 });
  const raw = await req.text();
  const sig = req.headers.get('x-razorpay-signature') || '';
  if (!same(await hmacHex(secret, raw), sig)) return new Response('bad signature', { status: 400 });

  const pay = proFromEvent(JSON.parse(raw), Number(Deno.env.get('PRO_AMOUNT_PAISE') || 0));
  if (!pay) return new Response('ignored');

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { error } = await db.from('payments').insert({ provider: 'razorpay', provider_payment_id: pay.id, email: pay.email, amount: pay.amount, currency: 'INR', status: 'captured' });
  if (error && error.code === '23505') return new Response('already processed');
  if (error) return new Response('database error', { status: 500 });
  const until = new Date(Date.now() + 30 * 86400000).toISOString();
  await db.from('profiles').update({ plan: 'pro', plan_until: until }).eq('email', pay.email);
  return new Response('ok');
});
