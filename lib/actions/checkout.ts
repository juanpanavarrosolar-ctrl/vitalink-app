'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { createFlowPayment } from '@/lib/flow';

// Anon client — RPCs con SECURITY DEFINER manejan el acceso a la DB
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

interface CheckoutInput {
  planId: string;
  planToken: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  region: string;
}

export async function initiateCheckout(input: CheckoutInput) {
  const supabase = anonClient();

  // Crear orden via RPC con SECURITY DEFINER (bypassa RLS)
  const { data: orderResult, error: orderErr } = await supabase.rpc('create_order_from_plan', {
    p_plan_id: input.planId,
    p_plan_token: input.planToken,
    p_patient_name: input.name,
    p_patient_email: input.email,
    p_phone: input.phone ?? null,
    p_address: input.address,
    p_city: input.city,
    p_region: input.region,
  });

  if (orderErr || !orderResult) {
    throw new Error('Error creando la orden. Intenta nuevamente.');
  }

  if (orderResult.error) {
    throw new Error(orderResult.error);
  }

  const { order_id, total } = orderResult as { order_id: string; total: number };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutrilink-app-psi.vercel.app';

  const flowPayment = await createFlowPayment({
    commerceOrder: order_id,
    subject: 'Plan NutriLink',
    amount: total,
    email: input.email,
    urlConfirmation: `${appUrl}/api/payments/flow-webhook`,
    urlReturn: `${appUrl}/checkout/success?order=${order_id}`,
  });

  // Registrar datos del pago Flow (SECURITY DEFINER RPC)
  await supabase.rpc('register_flow_payment', {
    p_order_id: order_id,
    p_flow_order_id: String(flowPayment.flowOrder),
    p_flow_payment_url: flowPayment.url,
    p_flow_token: flowPayment.token,
    p_amount: total,
  });

  redirect(flowPayment.url);
}
