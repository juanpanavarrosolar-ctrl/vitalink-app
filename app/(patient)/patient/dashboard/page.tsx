import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { formatCLP } from '@/lib/utils';
import type { BadgeColor } from '@/lib/types';

const ORDER_COLOR: Record<string, BadgeColor> = {
  pending_payment: 'amber', paid: 'emerald', preparing: 'blue',
  shipped: 'violet', delivered: 'emerald', cancelled: 'red', failed: 'red',
};
const ORDER_LABEL: Record<string, string> = {
  pending_payment: 'Pago pendiente', paid: 'Pagado', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado', failed: 'Fallido',
};

export default async function PatientDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName = (user?.user_metadata?.full_name as string | undefined)
    ?? (user?.email?.split('@')[0] ?? 'Paciente');

  // Try to find orders linked to this email
  const { data: orders } = user?.email
    ? await supabase
        .from('orders')
        .select('id, status, total, created_at, plans(id, title, public_token, plan_items(id, quantity, products(name, compound, dosage, price)))')
        .eq('patient_email', user.email)
        .order('created_at', { ascending: false })
        .limit(10)
    : { data: [] };

  const safeOrders = orders ?? [];
  const hasOrders = safeOrders.length > 0;

  return (
    <div style={{ padding: 'var(--sp-6)', maxWidth: 720, margin: '0 auto' }}>

      {/* Bienvenida */}
      <div style={{ marginBottom: 'var(--sp-6)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          ¡Hola, {displayName}!
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {hasOrders
            ? 'Aquí puedes ver tus protocolos y el estado de tus pedidos.'
            : 'Tu profesional de salud te enviará un link con tu protocolo personalizado para comenzar.'}
        </p>
      </div>

      {hasOrders ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {safeOrders.map((order: any, idx: number) => {
            const plan = order.plans as any;
            const items = (plan?.plan_items ?? []) as any[];
            return (
              <div
                key={order.id}
                style={{
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                  animation: `fadeInDown var(--duration-enter) var(--ease-out) ${idx * 60}ms both`,
                }}
              >
                {/* Plan header */}
                <div style={{ background: 'var(--color-primary)', padding: 'var(--sp-5) var(--sp-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                      Tu Protocolo
                    </div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                      {plan?.title ?? 'Protocolo'}
                    </div>
                  </div>
                  <Badge color={ORDER_COLOR[order.status] ?? 'slate'}>
                    {ORDER_LABEL[order.status] ?? order.status}
                  </Badge>
                </div>

                {/* Items */}
                {items.length > 0 && (
                  <div>
                    <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                        Tus suplementos ({items.length})
                      </span>
                    </div>
                    {items.slice(0, 4).map((item: any, i: number) => (
                      <div key={item.id} style={{
                        display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)',
                        borderBottom: i < Math.min(items.length, 4) - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                        alignItems: 'center',
                      }}>
                        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name="capsule" size={18} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.products?.name}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                            {item.products?.compound}{item.products?.dosage ? ` · ${item.products.dosage}` : ''}
                          </div>
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, flexShrink: 0 }}>
                          {formatCLP((item.products?.price ?? 0) * (item.quantity ?? 1))}
                        </div>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div style={{ padding: 'var(--sp-3) var(--sp-5)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        + {items.length - 4} suplemento{items.length - 4 !== 1 ? 's' : ''} más
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div style={{ padding: 'var(--sp-4) var(--sp-5)', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    Total: <strong style={{ color: 'var(--color-text)' }}>{formatCLP(order.total ?? 0)}</strong>
                  </div>
                  {plan?.public_token && (
                    <Link
                      href={`/p/${plan.public_token}`}
                      style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
                    >
                      Ver protocolo →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)', padding: 'var(--sp-12)', textAlign: 'center',
          animation: 'fadeInDown var(--duration-enter) var(--ease-out) 60ms both',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--color-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-5)',
          }}>
            <Icon name="heart" size={32} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
            Aún no tienes protocolos
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 360, margin: '0 auto var(--sp-6)' }}>
            Tu profesional de salud te enviará un link con tu protocolo personalizado. Una vez que lo recibas, podrás comprarlo directamente desde aquí.
          </p>
          <div style={{
            background: 'var(--color-primary-light)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-primary-subtle)', padding: 'var(--sp-4)',
            display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left', maxWidth: 380, margin: '0 auto',
          }}>
            <Icon name="info" size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 2 }}>¿Ya tienes un link?</div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Si tu profesional te envió un link, ábrelo directamente desde el mensaje que recibiste.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
