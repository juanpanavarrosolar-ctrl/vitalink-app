import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PROTOCOLS, formatCLP, hsColor } from '@/lib/mock-data';
import type { BadgeColor } from '@/lib/types';

const STATUS_COLOR: Record<string, BadgeColor> = { active: 'emerald', risk: 'red', paused: 'amber', expired: 'slate' };
const STATUS_LABEL: Record<string, string> = { active: 'Activo', risk: 'En riesgo', paused: 'Pausado', expired: 'Vencido' };

export default function ProtocolsPage() {
  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Protocolos</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>{PROTOCOLS.length} protocolos en total</p>
        </div>
        <Button icon="plus">Nuevo protocolo</Button>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-5)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Protocolo / Paciente</span>
          <span>Estado</span>
          <span>Health Score</span>
          <span>Valor mensual</span>
          <span>Renovación</span>
          <span>Acciones</span>
        </div>

        {PROTOCOLS.map((prot, i) => {
          const hsc = hsColor(prot.healthScore);
          return (
            <div key={prot.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < PROTOCOLS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={prot.patient.name} size={36} />
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{prot.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{prot.patient.name} · {prot.items.length} productos</div>
                </div>
              </div>
              <Badge color={STATUS_COLOR[prot.status] ?? 'slate'} dot>{STATUS_LABEL[prot.status] ?? prot.status}</Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: 'var(--color-border)', borderRadius: 2 }}>
                  <div style={{ width: `${prot.healthScore}%`, height: '100%', background: `var(--${hsc}-500)`, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: `var(--${hsc}-600)`, minWidth: 28, textAlign: 'right' }}>{prot.healthScore}</span>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{formatCLP(prot.monthlyValue)}</div>
                {prot.subscription && <Badge color="violet" style={{ fontSize: 10, padding: '2px 6px' }}>Suscripción</Badge>}
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: prot.renewalDays && prot.renewalDays <= 7 ? 600 : 400, color: prot.renewalDays && prot.renewalDays <= 0 ? 'var(--color-error)' : prot.renewalDays && prot.renewalDays <= 7 ? 'var(--color-warning)' : 'var(--color-text)' }}>
                  {prot.renewalDate}
                </div>
                {prot.renewalDays && prot.renewalDays > 0 && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>en {prot.renewalDays} días</div>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name="eye" size={14} />
                </button>
                <button style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name="link" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
