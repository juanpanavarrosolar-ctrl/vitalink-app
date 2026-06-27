'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { createClient } from '@/lib/supabase/client';

interface PatientTopbarProps {
  displayName: string;
  email: string;
}

export function PatientTopbar({ displayName, email }: PatientTopbarProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header style={{
      height: 60, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 var(--sp-6)', position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="heart" size={17} style={{ color: '#fff' }} aria-hidden="true" />
        </div>
        <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: 999, letterSpacing: '0.03em' }}>
          Mi Salud
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{displayName}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{email}</div>
        </div>
        <button
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          style={{
            background: 'none', border: '1px solid var(--color-border)', cursor: 'pointer',
            color: 'var(--color-text-secondary)', padding: '6px 10px', borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)',
            fontFamily: 'inherit',
          }}
        >
          <Icon name="logout" size={15} aria-hidden="true" />
          Salir
        </button>
      </div>
    </header>
  );
}
