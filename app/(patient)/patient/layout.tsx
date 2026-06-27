import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PatientTopbar } from '@/components/shell/patient-topbar';

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?role=patient');

  // Get display name from metadata or email prefix
  const displayName = (user.user_metadata?.full_name as string | undefined)
    ?? (user.email?.split('@')[0] ?? 'Paciente');

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <PatientTopbar displayName={displayName} email={user.email ?? ''} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
