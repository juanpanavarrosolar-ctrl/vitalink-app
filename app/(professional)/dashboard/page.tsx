import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { PROFESSIONAL, PROTOCOLS, ALERTS, ACTIVITY_FEED, FINANCE, formatCLP, hsColor } from '@/lib/mock-data';
import type { BadgeColor } from '@/lib/types';

const METRIC_CARDS = [
  { label: 'MRR', value: formatCLP(312000), change: '+12%', trend: 'up', color: 'var(--color-primary)' },
  { label: 'Protocolos activos', value: '24', change: '+3 este mes', trend: 'up', color: 'var(--blue-600)' },
  { label: 'Adherencia promedio', value: '78%', change: '-5% vs anterior', trend: 'down', color: 'var(--amber-600)' },
  { label: 'Pacientes en riesgo', value: '3', change: 'Requiere atención', trend: 'alert', color: 'var(--red-600)' },
];

const STATUS_COLOR: Record<string, BadgeColor> = { active: 'emerald', risk: 'red', paused: 'amber' };
const STATUS_LABEL: Record<string, string> = { active: 'Activo', risk: 'En riesgo', paused: 'Pausado' };

export default function DashboardPage() {
  const activeProtocols = PROTOCOLS.filter(p => p.status === 'active' || p.status === 'risk').slice(0, 4);

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          Buenos días, {PROFESSIONAL.firstName} 👋
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Tienes 3 renovaciones esta semana y 2 pacientes que necesitan seguimiento.
        </p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {METRIC_CARDS.map(m => (
          <div key={m.label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{m.label}</span>
              <Icon name={m.trend === 'up' ? 'trendUp' : m.trend === 'alert' ? 'bell' : 'arrowDown'} size={16} style={{ color: m.color }} />
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{m.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: m.trend === 'down' ? 'var(--color-warning)' : m.trend === 'alert' ? 'var(--color-error)' : 'var(--color-success)', marginTop: 4, fontWeight: 500 }}>{m.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-6)' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>

          {/* Active protocols */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Protocolos activos</h2>
              <a href="/protocols" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>Ver todos →</a>
            </div>
            <div>
              {activeProtocols.map((prot, i) => {
                const hsc = hsColor(prot.healthScore);
                return (
                  <div key={prot.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < activeProtocols.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                    <Avatar name={prot.patient.name} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prot.patient.name}</span>
                        <Badge color={STATUS_COLOR[prot.status] ?? 'slate'}>{STATUS_LABEL[prot.status] ?? prot.status}</Badge>
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{prot.name} · {prot.items.length} productos</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: `var(--${hsc}-600)` }}>{prot.healthScore}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Health score</div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 80 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{formatCLP(prot.monthlyValue)}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>/ mes</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Finance summary */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Proyección próximos 7 días</h2>
              <a href="/finance" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>Ver finanzas →</a>
            </div>
            <div style={{ padding: 'var(--sp-5)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)' }}>
              {[
                { label: 'Renovaciones', value: FINANCE.projectedNext.renewals, amount: FINANCE.projectedNext.renewalValue, icon: 'refresh', color: 'var(--violet-600)' },
                { label: 'Nuevos protocolos', value: FINANCE.projectedNext.newProtocols, amount: FINANCE.projectedNext.newValue, icon: 'plus', color: 'var(--blue-600)' },
                { label: 'Total proyectado', value: null, amount: FINANCE.projectedNext.total, icon: 'barChart', color: 'var(--color-primary)' },
              ].map(item => (
                <div key={item.label} style={{ padding: 'var(--sp-4)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <Icon name={item.icon} size={18} style={{ color: item.color, marginBottom: 8 }} />
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{item.label}</div>
                  {item.value !== null && <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-text)', marginTop: 2 }}>{item.value}</div>}
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: item.color }}>{formatCLP(item.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Alerts + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          {/* Alerts */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Alertas</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ALERTS.slice(0, 4).map((alert, i) => {
                const color: BadgeColor = alert.type === 'danger' ? 'red' : alert.type === 'warning' ? 'amber' : alert.type === 'success' ? 'emerald' : 'blue';
                return (
                  <div key={alert.id} style={{ padding: 'var(--sp-3) var(--sp-5)', borderBottom: i < 3 ? '1px solid var(--color-border-subtle)' : 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: `var(--${color === 'emerald' ? 'emerald' : color}-50)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Icon name={alert.icon} size={14} style={{ color: `var(--${color === 'emerald' ? 'emerald' : color}-600)` }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', fontWeight: 500, lineHeight: 1.4 }}>{alert.text}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{alert.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Actividad reciente</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ACTIVITY_FEED.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 'var(--sp-3) var(--sp-5)', borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  <Avatar name={item.patient} size={28} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{item.patient}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}> {item.text}</span>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 1 }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
