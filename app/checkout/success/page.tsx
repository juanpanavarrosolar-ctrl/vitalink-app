import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Icon } from '@/components/ui/icon';
import { formatCLP, formatDate } from '@/lib/utils';

// Anon client — get_order_summary RPC corre con SECURITY DEFINER
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const supabase = anonClient();

  const order = orderId
    ? await supabase.rpc('get_order_summary', { p_order_id: orderId }).then(r => r.data)
    : null;

  /* ── Si tenemos datos de la orden, la compra está confirmada.
     Si NO tenemos orden, el pago podría estar aún procesándose
     (webhook pendiente). Mostramos mensajes distintos para cada caso. */
  const isConfirmed = !!order;

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--sp-6)',
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* Ícono de estado */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: isConfirmed ? 'var(--emerald-100)' : 'var(--amber-100, #fef3c7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--sp-6)',
        }}>
          {isConfirmed
            ? <Icon name="check" size={40} style={{ color: 'var(--emerald-600)' }} />
            : <Icon name="clock" size={36} style={{ color: 'var(--amber-600, #d97706)' }} />
          }
        </div>

        {/* Título y descripción — coherentes con el estado real */}
        <h1 style={{
          fontSize: 'var(--text-2xl)', fontWeight: 800,
          letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          {isConfirmed ? '¡Compra confirmada!' : 'Pago en proceso'}
        </h1>

        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--sp-6)',
          lineHeight: 1.65,
        }}>
          {isConfirmed
            ? 'Tu pedido fue confirmado con éxito. Te enviaremos un email con los detalles de despacho en breve.'
            : 'Tu pago está siendo procesado. Recibirás un email de confirmación en los próximos minutos con el resumen de tu pedido.'
          }
        </p>

        {/* Resumen de orden — solo si tenemos datos */}
        {order && (
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: 'var(--sp-5)',
            marginBottom: 'var(--sp-6)',
            textAlign: 'left',
          }}>
            <div style={{
              fontSize: 'var(--text-xs)', fontWeight: 700,
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: 'var(--sp-4)',
            }}>
              Resumen de tu pedido
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[
                { label: 'N° Orden', value: `#${order.id.slice(0, 8).toUpperCase()}` },
                { label: 'Protocolo', value: order.plan_title ?? '—' },
                { label: 'Paciente', value: order.patient_name ?? '—' },
                { label: 'Total pagado', value: formatCLP(order.total ?? 0) },
                {
                  label: 'Fecha',
                  value: order.paid_at
                    ? formatDate(order.paid_at)
                    : formatDate(new Date().toISOString()),
                },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 'var(--text-sm)',
                  paddingBottom: 'var(--sp-2)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sin datos de orden: aviso más claro */}
        {!order && (
          <div style={{
            background: 'var(--amber-50, #fffbeb)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--amber-200, #fde68a)',
            padding: 'var(--sp-4)',
            marginBottom: 'var(--sp-6)',
            display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start',
            textAlign: 'left',
          }}>
            <Icon name="info" size={16} style={{ color: 'var(--amber-600, #d97706)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 4 }}>
                El resumen de tu pedido llegará por email
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Los pagos con Flow pueden demorar unos minutos en confirmarse. Revisa tu bandeja de entrada (o spam) para encontrar el comprobante.
              </p>
            </div>
          </div>
        )}

        {/* CTAs de navegación — lo que el paciente puede hacer ahora */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
          <Link
            href="/patient/dashboard"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px 20px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)', color: '#fff',
              fontSize: 'var(--text-sm)', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(5,150,105,0.3)',
            }}
          >
            <Icon name="user" size={15} style={{ color: '#fff' }} />
            Ver mi protocolo
          </Link>
          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 20px', borderRadius: 'var(--radius-md)',
              background: 'transparent', color: 'var(--color-text-secondary)',
              border: '1.5px solid var(--color-border)',
              fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none',
            }}
          >
            Volver al inicio
          </Link>
        </div>

        {/* Contacto */}
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
          ¿Tienes dudas? Contacta a tu nutricionista directamente o escríbenos a{' '}
          <a
            href="mailto:soporte@nutrilink.cl"
            style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
          >
            soporte@nutrilink.cl
          </a>
        </p>
      </div>
    </div>
  );
}
