import { createClient } from '@/lib/supabase/server';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { getFirstName } from '@/lib/utils';
import type { BadgeColor } from '@/lib/types';

const PLAN_COLOR: Record<string, BadgeColor> = {
  draft: 'slate', sent: 'blue', viewed: 'violet',
  accepted: 'emerald', purchased: 'emerald', expired: 'amber',
};
const PLAN_LABEL: Record<string, string> = {
  draft: 'Borrador', sent: 'Enviado', viewed: 'Visto',
  accepted: 'Aceptado', purchased: 'Comprado', expired: 'Vencido',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: professional } = await supabase
    .from('professionals')
    .select('id, full_name, specialty')
    .eq('user_id', user!.id)
    .single();

  const proId = professional?.id;

  const [plansResult, patientsResult, ordersResult] = await Promise.all([
    proId
      ? supabase
          .from('plans')
          .select('id, title, status, created_at, patients(name)')
          .eq('professional_id', proId)
          .order('created_at', { ascending: false })
          .limit(8)
      : Promise.resolve({ data: [] }),
    proId
      ? supabase
          .from('patients')
          .select('id', { count: 'exact', head: true })
          .eq('professional_id', proId)
      : Promise.resolve({ count: 0 }),
    proId
      ? supabase
          .from('orders')
          .select('id, status', { count: 'exact', head: true })
          .eq('professional_id', proId)
          .in('status', ['paid', 'preparing', 'shipped', 'delivered'])
      : Promise.resolve({ count: 0 }),
  ]);

  const plans = (plansResult.data ?? []) as any[];
  const patientCount = (patientsResult as any).count ?? 0;
  const completedOrderCount = (ordersResult as any).count ?? 0;

  const sentPlans = plans.filter((p: any) => ['sent', 'viewed', 'accepted', 'purchased'].includes(p.status));
  const isNewUser = plans.length === 0;
  const firstName = professional ? getFirstName(professional.full_name) : 'profesional';

  const metrics = [
    {
      label: 'Pacientes',
      value: String(patientCount),
      icon: 'users',
      color: 'var(--blue-600)',
      bg: 'rgba(37,99,235,0.06)',
      href: '/patients',
      sub: 'Registrados en tu cuenta',
    },
    {
      label: 'Protocolos enviados',
      value: String(sentPlans.length),
      icon: 'fileText',
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)',
      href: '/protocols',
      sub: `${plans.length} en total`,
    },
    {
      label: 'Compras completadas',
      value: String(completedOrderCount),
      icon: 'checkCircle',
      color: 'var(--emerald-600)',
      bg: 'rgba(5,150,105,0.06)',
      href: '/finance',
      sub: 'Órdenes pagadas',
    },
  ];

  const quickActions = [
    { label: 'Nuevo protocolo', href: '/protocols/new', icon: 'plus', primary: true },
    { label: 'Ver pacientes', href: '/patients', icon: 'users', primary: false },
    { label: 'Catálogo', href: '/catalog', icon: 'capsule', primary: false },
  ];

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          {getGreeting()}, {firstName} 👋
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>
          {isNewUser
            ? 'Bienvenido a NutriLink. Crea tu primer protocolo para comenzar.'
            : `Tienes ${sentPlans.length} protocolo${sentPlans.length !== 1 ? 's' : ''} enviado${sentPlans.length !== 1 ? 's' : ''} y ${patientCount} paciente${patientCount !== 1 ? 's' : ''}.`}
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)', flexWrap: 'wrap', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 60ms both' }}>
        {quickActions.map((a) => (
          <a
            key={a.href}
            href={a.href}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none',
              background: a.primary ? 'var(--color-primary)' : 'var(--color-surface)',
              color: a.primary ? '#fff' : 'var(--color-text)',
              border: a.primary ? 'none' : '1px solid var(--color-border)',
              boxShadow: a.primary ? 'var(--shadow-sm)' : 'none',
              transition: 'opacity 0.15s',
            }}
          >
            <Icon name={a.icon} size={15} aria-hidden="true" />
            {a.label}
          </a>
        ))}
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        {metrics.map((m, i) => (
          <a
            key={m.label}
            href={m.href}
            style={{
              background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
              padding: 'var(--sp-5)', border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)', textDecoration: 'none', display: 'block',
              animation: `fadeInDown var(--duration-enter) var(--ease-out) ${120 + i * 60}ms both`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--sp-3)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={m.icon} size={16} style={{ color: m.color }} aria-hidden="true" />
              </div>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{m.label}</span>
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {m.value}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 6 }}>{m.sub}</div>
          </a>
        ))}
      </div>

      {/* Recent protocols */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 300ms both' }}>
        <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Protocolos recientes</h2>
          <a href="/protocols" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Ver todos →
          </a>
        </div>

        {plans.length === 0 ? (
          <div style={{ padding: 'var(--sp-12)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-4)' }}>
              <Icon name="fileText" size={24} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-4)' }}>
              Aún no tienes protocolos. Crea el primero y envíaselo a tu paciente.
            </p>
            <a
              href="/protocols/new"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none' }}
            >
              <Icon name="plus" size={14} aria-hidden="true" />
              Crear primer protocolo
            </a>
          </div>
        ) : (
          <div>
            {plans.slice(0, 6).map((plan: any, i: number) => (
              <div
                key={plan.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
                  padding: 'var(--sp-4) var(--sp-5)',
                  borderBottom: i < Math.min(plans.length, 6) - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}
              >
                <Avatar name={plan.patients?.name ?? '?'} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a
                    href={`/protocols/${plan.id}`}
                    style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {plan.title}
                  </a>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {plan.patients?.name ?? 'Sin paciente'} · {new Date(plan.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <Badge color={PLAN_COLOR[plan.status] ?? 'slate'} dot>
                  {PLAN_LABEL[plan.status] ?? plan.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
