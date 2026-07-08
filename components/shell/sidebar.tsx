'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';

export interface SidebarProfessional {
  name: string;
  firstName: string;
  specialty: string;
}

const NAV = [
  { href: '/dashboard',  icon: 'home',     label: 'Dashboard' },
  { href: '/protocols',  icon: 'fileText', label: 'Protocolos' },
  { href: '/patients',   icon: 'users',    label: 'Pacientes' },
  { href: '/catalog',    icon: 'package',  label: 'Catálogo' },
  { href: '/finance',    icon: 'barChart', label: 'Finanzas' },
];

const NAV_BOTTOM = [
  { href: '/settings',   icon: 'settings', label: 'Ajustes' },
];

interface SidebarProps {
  professional?: SidebarProfessional;
}

export function Sidebar({ professional }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const displayName = professional?.firstName ?? professional?.name?.split(' ')[0] ?? '—';
  const displaySpecialty = professional?.specialty ?? 'Nutricionista';

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside style={{
      width: 'var(--sidebar-width)', height: '100dvh',
      background: 'var(--sidebar-bg)', display: 'flex',
      flexDirection: 'column', flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" size={18} style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>VitaLink</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--sidebar-text)' }}>Panel profesional</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV.map(item => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 'var(--radius-md)', color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
              background: active ? 'var(--sidebar-active)' : 'transparent',
              fontSize: 'var(--text-sm)', fontWeight: active ? 600 : 500,
              transition: 'all var(--duration-fast) var(--ease-in-out)',
              textDecoration: 'none',
            }}>
              <Icon name={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '8px 10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_BOTTOM.map(item => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 'var(--radius-md)', color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
              background: active ? 'var(--sidebar-active)' : 'transparent',
              fontSize: 'var(--text-sm)', fontWeight: active ? 600 : 500,
              transition: 'all var(--duration-fast) var(--ease-in-out)',
              textDecoration: 'none',
            }}>
              <Icon name={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* Professional profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginTop: 4 }}>
          <Avatar name={professional?.name ?? displayName} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--sidebar-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displaySpecialty}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sidebar-text)', padding: 4, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', flexShrink: 0 }}
          >
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
