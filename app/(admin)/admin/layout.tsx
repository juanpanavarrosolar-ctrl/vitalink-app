'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin/dashboard',       icon: 'home',      label: 'Dashboard' },
  { href: '/admin/profesionales',   icon: 'users',     label: 'Profesionales' },
  { href: '/admin/productos',       icon: 'package',   label: 'Productos' },
  { href: '/admin/ordenes',         icon: 'barChart',  label: 'Órdenes' },
  { href: '/admin/ajustes',         icon: 'settings',  label: 'Ajustes' },
];

function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside style={{
      width: 220, height: '100dvh', flexShrink: 0,
      background: '#0f172a', display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shield" size={18} style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>NutriLink</div>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin</div>
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
              borderRadius: 8, fontSize: 14, fontWeight: active ? 600 : 500,
              textDecoration: 'none', transition: 'all 0.15s ease',
              color: active ? '#fff' : 'rgba(255,255,255,0.5)',
              background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
              borderLeft: active ? '2px solid #6366f1' : '2px solid transparent',
            }}>
              <Icon name={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>AD</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Administrador</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>admin@nutrilink.cl</div>
          </div>
          <button onClick={handleLogout} title="Cerrar sesión"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)' }}>
        {children}
      </main>
    </div>
  );
}
