import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProtocolEditor } from './protocol-editor';

export default async function ProtocolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  if (!professional) notFound();

  const [planResult, productsResult] = await Promise.all([
    supabase
      .from('plans')
      .select(`
        id, title, status, notes, duration_days, public_token, expires_at, created_at,
        patients(id, name, email, phone),
        plan_items(id, quantity, instructions, frequency, duration_days,
          products(id, name, brand, compound, dosage, price))
      `)
      .eq('id', id)
      .eq('professional_id', professional.id)
      .single(),
    supabase
      .from('products')
      .select('id, name, brand, compound, dosage, price, stock_status')
      .eq('stock_status', 'active')
      .order('name'),
  ]);

  if (planResult.error || !planResult.data) notFound();

  return (
    <ProtocolEditor
      plan={planResult.data as any}
      availableProducts={productsResult.data ?? []}
    />
  );
}
