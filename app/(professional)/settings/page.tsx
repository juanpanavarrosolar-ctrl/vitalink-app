import { createClient } from '@/lib/supabase/server';
import { SettingsView } from './settings-view';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: professional } = await supabase
    .from('professionals')
    .select('id, full_name, profession, specialty, clinic_name, license_number, verification_status, discount_mode, discount_value')
    .eq('user_id', user!.id)
    .single();

  return (
    <SettingsView
      email={user!.email ?? ''}
      professional={professional ?? null}
    />
  );
}
