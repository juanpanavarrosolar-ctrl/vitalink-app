import { createClient } from '@/lib/supabase/server';
import { PatientsView } from './patients-view';

export default async function PatientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  const { data: patients } = professional
    ? await supabase
        .from('patients')
        .select('id, name, email, phone, birth_year, consent_status, created_at')
        .eq('professional_id', professional.id)
        .order('created_at', { ascending: false })
    : { data: [] };

  return <PatientsView patients={patients ?? []} />;
}
