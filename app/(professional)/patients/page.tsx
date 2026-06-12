import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PATIENTS, formatCLP, hsColor } from '@/lib/mock-data';
import type { BadgeColor } from '@/lib/types';

const STATUS_COLOR: Record<string, BadgeColor> = { active: 'emerald', risk: 'red', paused: 'amber', inactive: 'slate' };
const STATUS_LABEL: Record<string, string> = { active: 'Activo', risk: 'En riesgo', paused: 'Pausado', inactive: 'Inactivo' };

export default function PatientsPage() {
  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Pacientes</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>{PATIENTS.length} pacientes registrados</p>
        </div>
        <Button icon="plus">Agregar paciente</Button>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-5)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Paciente</span>
          <span>Estado</span>
          <span>Adherencia</span>
          <span>Health Score</span>
          <span>Total generado</span>
          <span>Acciones</span>
        </div>

        {PATIENTS.map((patient, i) => {
          const hsc = hsColor(patient.healthScore);
          return (
            <div key={patient.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < PATIENTS.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={patient.name} size={36} />
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{patient.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{patient.age} años · {patient.condition}</div>
                </div>
              </div>
              <Badge color={STATUS_COLOR[patient.status] ?? 'slate'} dot>{STATUS_LABEL[patient.status] ?? patient.status}</Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: 'var(--color-border)', borderRadius: 2 }}>
                  <div style={{ width: `${patient.adherence}%`, height: '100%', background: patient.adherence >= 75 ? 'var(--emerald-500)' : patient.adherence >= 50 ? 'var(--amber-500)' : 'var(--red-500)', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{patient.adherence}%</span>
              </div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: `var(--${hsc}-600)` }}>{patient.healthScore}</span>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{formatCLP(patient.totalSpent)}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{patient.monthsActive} meses</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name="eye" size={14} />
                </button>
                <button style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name="phone" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
