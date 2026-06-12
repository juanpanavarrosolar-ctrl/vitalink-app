import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { PROTOCOLS, formatCLP } from '@/lib/mock-data';
import type { BadgeColor } from '@/lib/types';

const ITEM_COLOR: Record<string, BadgeColor> = { active: 'emerald', warning: 'amber', expired: 'red' };
const ITEM_LABEL: Record<string, string> = { active: 'Activo', warning: 'Por renovar', expired: 'Vencido' };

export default function PatientProtocolPage({ params }: { params: { token: string } }) {
  const protocol = PROTOCOLS.find(p => p.shortToken === params.token);

  if (!protocol) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 8 }}>Protocolo no encontrado</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>El enlace puede haber expirado o ser incorrecto.</div>
        </div>
      </div>
    );
  }

  const total = protocol.items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', padding: 'var(--sp-6)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-4)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={20} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>{protocol.name}</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Hola, <strong>{protocol.patient.name}</strong>. Aquí está tu protocolo de suplementación.
          </p>
        </div>

        {/* Health score */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Tu Health Score</div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{protocol.healthScore}</div>
          </div>
          <div style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>{protocol.healthScore}</span>
          </div>
        </div>

        {/* Products */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--sp-4)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)', fontWeight: 700 }}>
            Tus suplementos ({protocol.items.length})
          </div>
          {protocol.items.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < protocol.items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="capsule" size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{item.product.name}</span>
                  <Badge color={ITEM_COLOR[item.status]}>{ITEM_LABEL[item.status]}</Badge>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  {item.product.compound} · {item.product.dosage} · {item.product.brand}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                  <Icon name="clock" size={12} />
                  <strong>{item.instruction}</strong>
                </div>
                {item.status !== 'expired' && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                    {item.daysLeft} días restantes
                  </div>
                )}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textAlign: 'right', minWidth: 70 }}>
                {formatCLP(item.product.price)}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
            <span style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Total del protocolo</span>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>{formatCLP(total)}</span>
          </div>
          {protocol.subscription && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'var(--sp-3)', background: 'var(--violet-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--sp-4)', fontSize: 'var(--text-sm)' }}>
              <Icon name="refresh" size={16} style={{ color: 'var(--violet-600)' }} />
              <span style={{ color: 'var(--violet-700)', fontWeight: 500 }}>Suscripción activa — se renueva el {protocol.renewalDate}</span>
            </div>
          )}
          <button style={{ width: '100%', padding: 'var(--sp-4)', background: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-md)', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon name="cart" size={20} />
            Comprar protocolo completo
          </button>
          <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--sp-3)' }}>
            Pago seguro · Despacho a todo Chile · Recomendado por {protocol.patient.name.split(' ')[0] === protocol.patient.name.split(' ')[0] ? 'tu nutricionista' : 'tu profesional'}
          </p>
        </div>
      </div>
    </div>
  );
}
