import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { DisclaimerModal } from '@/components/patient/disclaimer-modal';
import { CheckoutButton } from '@/components/patient/checkout-button';
import { ShareButton } from '@/components/patient/share-button';
import { NutriGuiaWidget } from '@/components/ai/nutriguia-widget';
import { formatCLP } from '@/lib/utils';

// Anon client — RLS policies allow anon to read public plans
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const STATUS_LABEL: Record<string, string> = {
  sent: 'Protocolo enviado',
  viewed: 'Protocolo activo',
  accepted: 'Protocolo activo',
  purchased: 'Ya compraste este protocolo',
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function PatientProtocolPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = anonClient();

  const { data: plan } = await supabase
    .from('plans')
    .select(`
      id, title, notes, status, public_token, expires_at, duration_days,
      professionals ( full_name, specialty, verification_status, discount_mode, discount_value ),
      patients ( name ),
      plan_items (
        id, quantity, instructions, duration_days,
        products ( id, name, compound, dosage, brand, format, price, description_safe, image_url )
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
  const verified = professional?.verification_status === 'verified';
  const expiresLabel = formatDate(plan.expires_at);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutrilink-app-psi.vercel.app';
  const shareUrl = `${appUrl}/p/${token}`;

  return (
    <>
      <DisclaimerModal />
      <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingBottom: 120 }}>

        {/* Sticky brand header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20, background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)', padding: '14px var(--sp-6)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={16} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-0.02em' }}>VitaLink</span>
          </div>
          <ShareButton url={shareUrl} />
        </div>

        <div style={{ maxWidth: 580, margin: '0 auto', padding: 'var(--sp-6)' }}>

          {/* Professional card */}
          {professional && (
            <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--sp-5)', overflow: 'hidden', background: 'var(--color-surface)' }}>
              <div style={{ height: 56, background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }} />
              <div style={{ padding: 'var(--sp-5)', paddingTop: 0, display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-4)', marginTop: -28 }}>
                <Avatar name={professional.full_name ?? 'Profesional'} size={56} style={{ border: '3px solid var(--color-surface)' }} />
                <div style={{ flex: 1, paddingBottom: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{professional.full_name}</span>
                    {verified && <Badge color="emerald" dot>Verificado</Badge>}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {professional.specialty ?? 'Profesional de salud'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Protocol header */}
          <div style={{ marginBottom: 'var(--sp-5)' }}>
            <Badge color={purchased ? 'emerald' : 'blue'} style={{ marginBottom: 10 }}>
              {STATUS_LABEL[plan.status] ?? 'Protocolo activo'}
            </Badge>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              {plan.title}
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {patient?.name ? <>Para <strong style={{ color: 'var(--color-text)' }}>{patient.name}</strong></> : 'Tu protocolo de suplementación'}
              {plan.duration_days ? ` · ${plan.duration_days} días` : ''}
              {expiresLabel ? ` · Válido hasta ${expiresLabel}` : ''}
            </p>
          </div>

          {/* Summary + shipping info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="capsule" size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{items.length}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Productos sugeridos</div>
              </div>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="truck" size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>Despacho a domicilio</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Todo Chile</div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div style={{ marginBottom: 'var(--sp-5)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Tus suplementos
            </div>
            {items.length === 0 ? (
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-6)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                Este protocolo aún no tiene productos.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {items.map((item: any) => (
                  <div key={item.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', alignItems: 'flex-start' }}>
                      {item.products?.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.products.image_url} alt={item.products?.name ?? ''} style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name="capsule" size={22} style={{ color: 'var(--color-primary)' }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{item.products?.name}</span>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textAlign: 'right', minWidth: 70, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                            {formatCLP((item.products?.price ?? 0) * (item.quantity ?? 1))}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                          {item.products?.brand && <Badge color="slate">{item.products.brand}</Badge>}
                          {item.products?.format && <Badge color="slate">{item.products.format}</Badge>}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {item.products?.compound}{item.products?.dosage ? ` · ${item.products.dosage}` : ''}
                        </div>
                        {item.products?.description_safe && (
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                            {item.products.description_safe}
                          </p>
                        )}
                      </div>
                    </div>
                    {(item.instructions || item.duration_days) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px var(--sp-5)', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                        <Icon name="clock" size={13} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
                        <span>
                          {item.instructions && <strong>{item.instructions}</strong>}
                          {item.instructions && item.duration_days ? ' · ' : ''}
                          {item.duration_days ? `${item.duration_days} días` : ''}
                          {item.quantity > 1 ? ` · ${item.quantity} unidades` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {plan.notes && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-5)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Notas del profesional
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                {plan.notes}
              </p>
            </div>
          )}

          {/* Commission disclosure (regulatory required) */}
          <div style={{ background: 'rgba(8,145,178,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(8,145,178,0.2)', padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)', display: 'flex', gap: 12 }}>
            <Icon name="info" size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Este protocolo incluye una comisión del <strong style={{ color: 'var(--color-text)' }}>{commissionPct}% ({formatCLP(commissionAmt)})</strong> para {professional?.full_name ?? 'tu profesional'},
              quien avala y hace seguimiento de tu plan de suplementación. La comisión es transparente y forma parte del precio total.
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            Pago seguro vía Flow · Despacho a todo Chile · Suplementos con registro sanitario ISP
          </p>

        </div>
      </div>

      {/* Sticky checkout bar */}
      <div style={{
        position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ maxWidth: 580, margin: '0 auto', padding: 'var(--sp-4) var(--sp-6)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Total</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {formatCLP(total)}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <CheckoutButton
              planId={plan.id}
              planToken={token}
              total={total}
              disabled={purchased}
            />
          </div>
        </div>
      </div>

      <NutriGuiaWidget planToken={token} />
    </>
  );
}
