import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { formatCLP, formatDate } from '@/lib/utils';
import type { BadgeColor } from '@/lib/types';

const ORDER_COLOR: Record<string, BadgeColor> = {
  pending_payment: 'amber', paid: 'emerald', preparing: 'blue',
  shipped: 'violet', delivered: 'emerald', cancelled: 'red', failed: 'red',
};
const ORDER_LABEL: Record<string, string> = {
  pending_payment: 'Pago pendiente', paid: 'Pagado', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado', failed: 'Fallido',
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, subtotal, total, commission_amt, patient_name, patient_email, created_at, paid_at, plans(title), professionals(full_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  const safeOrders = orders ?? [];
  const paidOrders = safeOrders.filter(o => ['paid', 'delivered', 'shipped', 'preparing'].includes(o.status));
  const gmv = paidOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const totalCommissions = paidOrders.reduce((s, o) => s + (o.commission_amt ?? 0), 0);

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--sp-6)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Órdenes</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          {safeOrders.length} órdenes totales
        </p>
      </div>

      {/* GMV Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'GMV (pagado)', value: formatCLP(gmv), icon: 'trendUp', color: 'var(--color-primary)' },
          { label: 'Comisiones', value: formatCLP(totalCommissions), icon: 'star', color: 'var(--violet-600)' },
          { label: 'Tasa conversión', value: safeOrders.length ? `${Math.round(paidOrders.length / safeOrders.length * 100)}%` : '—', icon: 'barChart', color: 'var(--blue-600)' },
        ].map((m, i) => (
          <div key={m.label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', animation: `fadeInDown var(--duration-enter) var(--ease-out) ${i * 60}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{m.label}</span>
              <Icon name={m.icon} size={16} style={{ color: m.color }} />
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 180ms both' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1fr 1fr 1fr', gap: 'var(--sp-3)', padding: 'var(--sp-3) var(--sp-5)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Profesional</span>
          <span>Paciente</span>
          <span>Protocolo</span>
          <span>Estado</span>
          <span>Comisión</span>
          <span>Total</span>
        </div>
        {safeOrders.map((order, i) => (
          <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1fr 1fr 1fr', gap: 'var(--sp-3)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < safeOrders.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
            <div style={{ fontSize: 'var(--text-sm)' }}>{(order.professionals as any)?.full_name ?? '—'}</div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)' }}>{order.patient_name ?? '—'}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{formatDate(order.created_at)}</div>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(order.plans as any)?.title ?? '—'}
            </div>
            <Badge color={ORDER_COLOR[order.status] ?? 'slate'}>
              {ORDER_LABEL[order.status] ?? order.status}
            </Badge>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--violet-600)', fontVariantNumeric: 'tabular-nums' }}>
              {order.commission_amt ? formatCLP(order.commission_amt) : '—'}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {formatCLP(order.total ?? 0)}
            </div>
          </div>
        ))}
        {safeOrders.length === 0 && (
          <div style={{ padding: 'var(--sp-10)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <Icon name="barChart" size={28} style={{ margin: '0 auto var(--sp-3)', color: 'var(--color-text-tertiary)' }} />
            No hay órdenes aún.
          </div>
        )}
      </div>
    </div>
  );
}
