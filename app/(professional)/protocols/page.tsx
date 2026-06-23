import { createClient } from '@/lib/supabase/server';
import { ProtocolsView } from './protocols-view';

export default async function ProtocolsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  const [plansResult, patientsResult] = await Promise.all([
    professional
      ? supabase
          .from('plans')
          .select('id, title, status, duration_days, public_token, expires_at, created_at, patients(id, name)')
          .eq('professional_id', professional.id)
          .order('created_at', { ascending: false })
      : { data: [] },
    professional
      ? supabase
          .from('patients')
          .select('id, name, email')
          .eq('professional_id', professional.id)
          .order('name')
      : { data: [] },
  ]);

  return (
    <ProtocolsView
      plans={(plansResult.data ?? []) as any[]}
      patients={(patientsResult.data ?? []) as any[]}
    />
  );
}
