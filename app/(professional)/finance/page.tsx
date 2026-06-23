import { createClient } from '@/lib/supabase/server';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { formatCLP, formatDate } from '@/lib/utils';
import type { BadgeColor } from '@/lib/types';

const ORDER_COLOR: Record<string, BadgeColor> = {
  pending_payment: 'amber', paid: 'emerald', preparing: 'blue',
  shipped: 'violet', delivered: 'emerald', cancelled: 'red',
  refunded: 'slate', failed: 'red',
};
const ORDER_LABEL: Record<string, string> = {
  pending_payment: 'Pago pendiente', paid: 'Pagado', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
  refunded: 'Reembolsado', failed: 'Fallido',
};

export default async function FinancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user!.id)
    .single();

  const { data: orders } = professional
    ? await supabase
        .from('orders')
        .select('id, status, subtotal, total, commission_pct, commission_amt, patient_name, created_at, paid_at, plans(title)')
        .eq('professional_id', professional.id)
        .order('created_at', { ascending: false })
        .limit(50)
    : { data: [] };

  const safeOrders = orders ?? [];
  const paidOrders = safeOrders.filter(o => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped' || o.status === 'preparing');
  const totalRevenue = paidOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const totalCommissions = paidOrders.reduce((s, o) => s + (o.commission_amt ?? 0), 0);
  const pendingOrders = safeOrders.filter(o => o.status === 'pending_payment').length;

  const metrics = [
    { label: 'Total generado', value: formatCLP(totalRevenue), icon: 'trendUp', color: 'var(--color-primary)', sub: `${paidOrders.length} órdenes pagadas` },
    { label: 'Comisiones', value: formatCLP(totalCommissions), icon: 'star', color: 'var(--violet-600)', sub: 'Acumulado' },
    { label: 'Órdenes totales', value: String(safeOrders.length), icon: 'barChart', color: 'var(--blue-600)', sub: `${pendingOrders} pendientes` },
  ];

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--sp-8)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Finanzas</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Historial de órdenes y comisiones</p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {metrics.map((m, i) => (
          <div key={m.label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', animation: `fadeInDown var(--duration-enter) var(--ease-out) ${i * 60}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{m.label}</span>
              <Icon name={m.icon} size={18} style={{ color: m.color }} />
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 180ms both' }}>
        <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)', fontWeight: 700 }}>
          Historial de órdenes
        </div>
        {safeOrders.length === 0 ? (
          <div style={{ padding: 'var(--sp-10)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <Icon name="barChart" size={32} style={{ margin: '0 auto var(--sp-3)', color: 'var(--color-text-tertiary)' }} />
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Sin órdenes aún</div>
            <p style={{ fontSize: 'var(--text-sm)' }}>Las órdenes aparecerán aquí cuando los pacientes compren sus protocolos.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-5)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>Protocolo / Paciente</span>
              <span>Fecha</span>
              <span>Estado</span>
              <span>Comisión</span>
              <span>Total</span>
              <span></span>
            </div>
            {safeOrders.map((order, i) => (
              <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < safeOrders.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{(order.plans as any)?.title ?? 'Protocolo'}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{order.patient_name ?? 'Paciente'}</div>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {formatDate(order.created_at)}
                </div>
                <Badge color={ORDER_COLOR[order.status] ?? 'slate'}>
                  {ORDER_LABEL[order.status] ?? order.status}
                </Badge>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--violet-600)', fontVariantNumeric: 'tabular-nums' }}>
                  {order.commission_amt ? formatCLP(order.commission_amt) : `${order.commission_pct ?? 15}%`}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatCLP(order.total ?? 0)}
                </div>
                <div />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
