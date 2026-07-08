import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { PATIENTS, PRODUCTS, PROTOCOLS, PROFESSIONAL } from '@/lib/mock-data';

const STATS = [
  { label: 'Profesionales', value: '3', sub: '2 verificados', icon: 'users', color: 'var(--teal-600)', bg: 'rgba(8,145,178,0.08)' },
  { label: 'Pacientes activos', value: String(PATIENTS.filter(p => p.status === 'active').length), sub: `${PATIENTS.length} total`, icon: 'heart', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
  { label: 'Productos catálogo', value: String(PRODUCTS.length), sub: '4 por aprobar', icon: 'package', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Planes activos', value: String(PROTOCOLS.filter(p => p.status === 'active').length), sub: 'este mes', icon: 'fileText', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
];

const PROFESSIONALS = [
  { name: 'Dra. María Torres', email: 'demo@vitalink.cl', specialty: 'Nutricionista Clínica', patients: PATIENTS.length, status: 'verified', since: '1 Ene 2025' },
  { name: 'Dra. Carmen Silva', email: 'nutri@vitalink.cl', specialty: 'Nutrición Deportiva', patients: 1, status: 'verified', since: '12 Jun 2026' },
  { name: 'Administrador', email: 'admin@vitalink.cl', specialty: '—', patients: 0, status: 'admin', since: '12 Jun 2026' },
];

const STATUS_MAP: Record<string, { label: string; color: 'emerald' | 'violet' | 'amber' }> = {
  verified: { label: 'Verificado', color: 'emerald' },
  pending:  { label: 'Pendiente',  color: 'amber' },
  admin:    { label: 'Admin',      color: 'violet' },
};

const ACTIVITY = [
  { icon: 'users',    msg: 'Nuevo profesional registrado: Dra. Carmen Silva',   time: 'Hace 2 horas' },
  { icon: 'fileText', msg: 'Plan "Protocolo RI Avanzado" enviado a Francisca M.', time: 'Hace 5 horas' },
  { icon: 'package',  msg: '4 productos pendientes de aprobación de claims',      time: 'Hace 1 día'  },
  { icon: 'heart',    msg: 'Nuevo paciente registrado: Juan Demo Paciente',       time: 'Hace 1 día'  },
  { icon: 'barChart', msg: 'Orden #1042 completada — $63.960',                   time: 'Hace 2 días' },
];

export default function AdminDashboardPage() {
  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Panel de Administración</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Resumen de la plataforma VitaLink</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5)', animation: `fadeInDown var(--duration-enter) var(--ease-out) ${i * 60}ms both` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={s.icon} size={16} style={{ color: s.color }} />
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text)', marginBottom: 2, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-6)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 240ms both' }}>

        {/* Professionals table */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>Profesionales registrados</span>
            <Badge color="violet">{PROFESSIONALS.length} total</Badge>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                {['Nombre', 'Especialidad', 'Pacientes', 'Estado', 'Desde'].map(h => (
                  <th key={h} style={{ padding: 'var(--sp-3) var(--sp-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROFESSIONALS.map((pro, i) => (
                <tr key={pro.email} style={{ borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  <td style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{pro.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{pro.email}</div>
                  </td>
                  <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{pro.specialty}</td>
                  <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>{pro.patients}</td>
                  <td style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
                    <Badge color={STATUS_MAP[pro.status].color}>{STATUS_MAP[pro.status].label}</Badge>
                  </td>
                  <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{pro.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity feed */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontWeight: 700 }}>Actividad reciente</span>
          </div>
          <div style={{ padding: 'var(--sp-2)' }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--sp-3)', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(8,145,178,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={a.icon} size={15} style={{ color: 'var(--teal-600)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-xs)', lineHeight: 1.4, fontWeight: 500 }}>{a.msg}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
