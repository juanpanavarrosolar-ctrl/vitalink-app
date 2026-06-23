import { createClient } from '@/lib/supabase/server';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { formatCLP, getFirstName } from '@/lib/utils';
import type { BadgeColor } from '@/lib/types';

const PLAN_COLOR: Record<string, BadgeColor> = {
  draft: 'slate', sent: 'blue', viewed: 'violet',
  accepted: 'emerald', purchased: 'emerald', expired: 'amber',
};
const PLAN_LABEL: Record<string, string> = {
  draft: 'Borrador', sent: 'Enviado', viewed: 'Visto',
  accepted: 'Aceptado', purchased: 'Comprado', expired: 'Vencido',
};

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
          .limit(20)
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
          .select('id, status, total, commission_amt, patient_name, created_at')
          .eq('professional_id', proId)
          .order('created_at', { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] }),
  ]);

  const plans = (plansResult.data ?? []) as any[];
  const patientCount = (patientsResult as any).count ?? 0;
  const orders = (ordersResult.data ?? []) as any[];

  const activePlans = plans.filter((p: any) => ['sent', 'viewed', 'accepted', 'purchased'].includes(p.status));
  const totalCommissions = orders
    .filter((o: any) => ['paid', 'delivered', 'shipped', 'preparing'].includes(o.status))
    .reduce((s: number, o: any) => s + (o.commission_amt ?? 0), 0);

  const firstName = professional ? getFirstName(professional.full_name) : 'profesional';

  const metrics = [
    { label: 'Protocolos activos', value: String(activePlans.length), icon: 'fileText', color: 'var(--color-primary)', sub: `${plans.length} total` },
    { label: 'Pacientes', value: String(patientCount), icon: 'users', color: 'var(--blue-600)', sub: 'Registrados' },
    { label: 'Órdenes', value: String(orders.length), icon: 'barChart', color: 'var(--violet-600)', sub: 'Recientes' },
    { label: 'Comisiones', value: formatCLP(totalCommissions), icon: 'trendUp', color: 'var(--amber-600)', sub: 'Acumulado' },
  ];

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          Buenos días, {firstName} 👋
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          {activePlans.length > 0
            ? `Tienes ${activePlans.length} protocolo${activePlans.length !== 1 ? 's' : ''} activo${activePlans.length !== 1 ? 's' : ''} y ${patientCount} paciente${patientCount !== 1 ? 's' : ''} registrado${patientCount !== 1 ? 's' : ''}.`
            : 'Bienvenido a NutriLink. Crea tu primer protocolo para comenzar.'}
        </p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {metrics.map((m, i) => (
          <div key={m.label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', animation: `fadeInDown var(--duration-enter) var(--ease-out) ${i * 60}ms both` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{m.label}</span>
              <Icon name={m.icon} size={16} style={{ color: m.color }} />
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-6)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 240ms both' }}>
        {/* Recent protocols */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Protocolos recientes</h2>
            <a href="/protocols" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Ver todos →</a>
          </div>
          {plans.length === 0 ? (
            <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <Icon name="fileText" size={28} style={{ margin: '0 auto var(--sp-3)', color: 'var(--color-text-tertiary)' }} />
              <div style={{ fontSize: 'var(--text-sm)', marginBottom: 8 }}>Aún no tienes protocolos.</div>
              <a href="/protocols" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>Crear primero →</a>
            </div>
          ) : (
            <div>
              {plans.slice(0, 5).map((plan: any, i: number) => (
                <div key={plan.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < Math.min(plans.length, 5) - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  <Avatar name={plan.patients?.name ?? '?'} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a href={`/protocols/${plan.id}`} style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {plan.title}
                    </a>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      {plan.patients?.name ?? 'Sin paciente'}
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

        {/* Recent orders */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Órdenes recientes</h2>
            <a href="/finance" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Ver todas →</a>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: 'var(--sp-6)', textAlign: 'center' }}>
              <Icon name="barChart" size={24} style={{ margin: '0 auto var(--sp-2)', color: 'var(--color-text-tertiary)' }} />
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Sin órdenes aún</div>
            </div>
          ) : (
            <div style={{ padding: 'var(--sp-2)' }}>
              {orders.map((order: any) => (
                <div key={order.id} style={{ display: 'flex', gap: 'var(--sp-3)', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(8,145,178,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="barChart" size={15} style={{ color: 'var(--teal-600)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>
                      {order.patient_name ?? 'Paciente'} · {formatCLP(order.total ?? 0)}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {new Date(order.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
