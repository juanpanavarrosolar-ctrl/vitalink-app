import { createClient } from '@supabase/supabase-js';
import { Icon } from '@/components/ui/icon';
import { formatCLP, formatDate } from '@/lib/utils';

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  const supabase = serviceRole();

  const { data: order } = orderId
    ? await supabase
        .from('orders')
        .select('id, status, total, patient_name, patient_email, paid_at, plans(title)')
        .eq('id', orderId)
        .single()
    : { data: null };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-6)' }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--emerald-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-6)' }}>
          <Icon name="check" size={40} style={{ color: 'var(--emerald-600)' }} />
        </div>

        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
          ¡Compra realizada!
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-6)' }}>
          Tu pedido está confirmado. Te enviaremos un email con los detalles de despacho.
        </p>

        {order && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-6)', textAlign: 'left' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--sp-4)' }}>
              Resumen de tu pedido
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[
                { label: 'Orden', value: order.id.slice(0, 8).toUpperCase() },
                { label: 'Protocolo', value: (order.plans as any)?.title ?? '—' },
                { label: 'Paciente', value: order.patient_name ?? '—' },
                { label: 'Total pagado', value: formatCLP(order.total ?? 0) },
                { label: 'Fecha', value: order.paid_at ? formatDate(order.paid_at) : formatDate(new Date().toISOString()) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!order && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Tu pago está siendo procesado. Recibirás un email de confirmación en breve.
            </p>
          </div>
        )}

        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
          ¿Tienes dudas? Contacta a tu nutricionista directamente o escríbenos a soporte@nutrilink.cl
        </p>
      </div>
    </div>
  );
}
