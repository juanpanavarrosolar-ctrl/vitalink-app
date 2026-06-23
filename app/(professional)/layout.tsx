import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/shell/sidebar';

function getFirstName(fullName: string): string {
  const parts = fullName.split(' ');
  // Skip title prefixes: Dra., Dr., Lic., Nut.
  const titlePrefixes = ['dra.', 'dr.', 'lic.', 'nut.', 'prof.'];
  const first = parts.find(p => !titlePrefixes.includes(p.toLowerCase()));
  return first ?? parts[0] ?? fullName;
}

export default async function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: professional } = await supabase
    .from('professionals')
    .select('full_name, specialty')
    .eq('user_id', user.id)
    .single();

  const sidebarPro = professional
    ? {
        name: professional.full_name,
        firstName: getFirstName(professional.full_name),
        specialty: professional.specialty ?? 'Nutricionista',
      }
    : undefined;

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
      <Sidebar professional={sidebarPro} />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)' }}>
        {children}
      </main>
    </div>
  );
}
