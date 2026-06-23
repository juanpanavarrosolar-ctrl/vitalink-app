import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { DisclaimerModal } from '@/components/patient/disclaimer-modal';
import { CheckoutButton } from '@/components/patient/checkout-button';
import { formatCLP } from '@/lib/utils';

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export default async function PatientProtocolPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = serviceRole();

  const { data: plan } = await supabase
    .from('plans')
    .select(`
      id, title, notes, status, public_token, expires_at,
      professionals ( full_name, specialty, discount_mode, discount_value ),
      patients ( name ),
      plan_items (
        id, quantity, instructions, duration_days,
        products ( id, name, compound, dosage, brand, format, price, description_safe )
      )
    `)
    .eq('public_token', token)
    .single();

  if (!plan || ['draft', 'cancelled', 'expired'].includes(plan.status)) notFound();

  const professional = plan.professionals as any;
  const patient = plan.patients as any;
  const items = (plan.plan_items ?? []) as any[];

  const subtotal = items.reduce((s: number, i: any) => s + (i.products?.price ?? 0) * (i.quantity ?? 1), 0);
  const commissionPct = professional?.discount_mode === 'percentage'
    ? (professional.discount_value ?? 15)
    : 15;
  const commissionAmt = Math.round(subtotal * commissionPct / 100);
  const total = subtotal + commissionAmt;

  const purchased = plan.status === 'purchased';

  return (
    <>
      <DisclaimerModal />
      <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', padding: 'var(--sp-6)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>

          {/* Brand header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-5)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="heart" size={20} style={{ color: '#fff' }} />
              </div>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
              {plan.title}
            </h1>
            {patient?.name && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Hola, <strong>{patient.name}</strong>. Aquí está tu protocolo de suplementación.
              </p>
            )}
            {purchased && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '8px 16px', background: 'var(--emerald-50)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', color: 'var(--emerald-700)', fontWeight: 600 }}>
                ✓ Ya compraste este protocolo
              </div>
            )}
          </div>

          {/* Professional info */}
          {professional && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="user" size={20} style={{ color: '#fff' }} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{professional.full_name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {professional.specialty ?? 'Profesional de salud'} · Verificado por NutriLink
                </div>
              </div>
              <Badge color="emerald" style={{ marginLeft: 'auto' }}>Verificado</Badge>
            </div>
          )}

          {/* Products */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--sp-4)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)', fontWeight: 700 }}>
              Tus suplementos ({items.length})
            </div>
            {items.length === 0 ? (
              <div style={{ padding: 'var(--sp-6)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                Este protocolo aún no tiene productos.
              </div>
            ) : items.map((item: any, i: number) => (
              <div key={item.id} style={{ display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="capsule" size={20} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{item.products?.name}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                    {item.products?.compound}{item.products?.dosage ? ` · ${item.products.dosage}` : ''} · {item.products?.brand}
                  </div>
                  {item.instructions && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                      <Icon name="clock" size={12} />
                      <strong>{item.instructions}</strong>
                    </div>
                  )}
                  {item.duration_days && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {item.duration_days} días · {item.quantity > 1 ? `${item.quantity} unidades` : '1 unidad'}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textAlign: 'right', minWidth: 70, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                  {formatCLP((item.products?.price ?? 0) * (item.quantity ?? 1))}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {plan.notes && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Notas del profesional
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                {plan.notes}
              </p>
            </div>
          )}

          {/* Commission disclosure (regulatory required) */}
          <div style={{ background: 'rgba(8,145,178,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(8,145,178,0.2)', padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)', display: 'flex', gap: 12 }}>
            <Icon name="info" size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Este protocolo incluye una comisión del <strong style={{ color: 'var(--color-text)' }}>{commissionPct}% ({formatCLP(commissionAmt)})</strong> para {professional?.full_name ?? 'tu profesional'},
              quien avala y hace seguimiento de tu plan de suplementación. La comisión es transparente y forma parte del precio total.
            </p>
          </div>

          {/* Pricing & CTA */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)' }}>
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                <span>Subtotal productos</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCLP(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                <span>Honorarios profesional ({commissionPct}%)</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCLP(commissionAmt)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>{formatCLP(total)}</span>
              </div>
            </div>

            <CheckoutButton
              planId={plan.id}
              planToken={token}
              total={total}
              disabled={purchased}
            />

            <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--sp-3)' }}>
              Pago seguro vía Flow · Despacho a todo Chile · Suplementos con registro sanitario ISP
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
