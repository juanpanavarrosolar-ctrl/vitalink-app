import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

function formatCLP(n: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
}

const PLAN = {
  title: 'Protocolo Rendimiento & Energía',
  professional: 'Dra. Carmen Silva',
  specialty: 'Nutrición Deportiva y Funcional',
  clinic: 'Clínica NutriVida',
  duration: 90,
  daysLeft: 90,
  notes: 'Plan personalizado para optimizar rendimiento físico, energía y recuperación muscular.',
  items: [
    {
      name: 'Omega-3 1000mg',
      brand: 'Lab Natura',
      compound: 'EPA 600mg + DHA 400mg',
      dosage: '1000mg',
      instruction: 'Tomar con el almuerzo junto a alimentos grasos.',
      frequency: '1 vez al día',
      price: 32990,
      daysLeft: 90,
      status: 'active' as const,
    },
    {
      name: 'Vitamina D3 2000 UI',
      brand: 'Lab Natura',
      compound: 'Colecalciferol',
      dosage: '2000 UI',
      instruction: 'Tomar en la mañana con el desayuno.',
      frequency: '1 vez al día',
      price: 18990,
      daysLeft: 90,
      status: 'active' as const,
    },
    {
      name: 'Magnesio Bisglicinato 300mg',
      brand: 'Lab Natura',
      compound: 'Bisglicinato de Magnesio',
      dosage: '300mg',
      instruction: 'Tomar antes de dormir para mejor absorción.',
      frequency: '1 vez al día',
      price: 24990,
      daysLeft: 90,
      status: 'active' as const,
    },
  ],
};

const STATUS_COLOR: Record<string, 'emerald' | 'amber' | 'red'> = { active: 'emerald', warning: 'amber', expired: 'red' };
const STATUS_LABEL: Record<string, string> = { active: 'Activo', warning: 'Por renovar', expired: 'Vencido' };

export default function PatientDashboardPage() {
  const total = PLAN.items.reduce((s, i) => s + i.price, 0);

  return (
    <div style={{ padding: 'var(--sp-6)', maxWidth: 720, margin: '0 auto' }}>

      {/* Bienvenida */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>¡Hola, Juan!</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Tu plan de suplementación personalizado está listo.</p>
      </div>

      {/* Card del plan */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--sp-4)' }}>

        {/* Plan header */}
        <div style={{ background: 'var(--color-primary)', padding: 'var(--sp-5) var(--sp-6)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Tu Protocolo</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{PLAN.title}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{PLAN.daysLeft}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>días</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'var(--sp-3)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.8)' }}>
            <Icon name="users" size={14} />
            <span>{PLAN.professional} · {PLAN.clinic}</span>
          </div>
        </div>

        {/* Nota del profesional */}
        <div style={{ padding: 'var(--sp-4) var(--sp-6)', background: 'var(--color-primary-light)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="fileText" size={16} style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontStyle: 'italic', margin: 0 }}>
              &ldquo;{PLAN.notes}&rdquo;
            </p>
          </div>
        </div>

        {/* Items del plan */}
        <div>
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Tus suplementos ({PLAN.items.length})</span>
          </div>
          {PLAN.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)',
              borderBottom: i < PLAN.items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              alignItems: 'flex-start',
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="capsule" size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{item.name}</span>
                  <Badge color={STATUS_COLOR[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                  {item.compound} · {item.dosage} · {item.brand}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)' }}>
                  <Icon name="clock" size={12} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>{item.instruction}</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 3 }}>
                  {item.frequency} · {item.daysLeft} días restantes
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)', minWidth: 72, textAlign: 'right' }}>
                {formatCLP(item.price)}
              </div>
            </div>
          ))}
        </div>

        {/* CTA compra */}
        <div style={{ padding: 'var(--sp-5) var(--sp-6)', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
            <span style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Total del protocolo</span>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>{formatCLP(total)}</span>
          </div>
          <button style={{
            width: '100%', padding: 'var(--sp-4)', background: 'var(--color-primary)', color: '#fff',
            borderRadius: 'var(--radius-md)', fontSize: 'var(--text-md)', fontWeight: 700,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="cart" size={20} />
            Comprar mi protocolo completo
          </button>
          <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--sp-3)' }}>
            Pago seguro · Despacho a todo Chile · Recomendado por tu nutricionista
          </p>
        </div>
      </div>

      {/* Info adicional */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-3)' }}>
            <Icon name="calendar" size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Duración del plan</span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)' }}>{PLAN.duration} días</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Protocolo de {Math.round(PLAN.duration / 30)} meses</div>
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-3)' }}>
            <Icon name="heart" size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Tu profesional</span>
          </div>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{PLAN.professional}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{PLAN.specialty}</div>
        </div>
      </div>
    </div>
  );
}
