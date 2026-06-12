import { Icon } from '@/components/ui/icon';
import { FINANCE, formatCLP } from '@/lib/mock-data';

export default function FinancePage() {
  const metrics = [
    { label: 'MRR', value: formatCLP(FINANCE.mrr.value), change: `+${FINANCE.mrr.change}%`, icon: 'trendUp', color: 'var(--color-primary)' },
    { label: 'GMV del mes', value: formatCLP(FINANCE.gmv.value), change: `+${FINANCE.gmv.change}%`, icon: 'barChart', color: 'var(--blue-600)' },
    { label: 'Comisiones', value: formatCLP(FINANCE.commissions.value), change: `+${FINANCE.commissions.change}%`, icon: 'star', color: 'var(--violet-600)' },
    { label: 'Total generado', value: formatCLP(FINANCE.totalGenerated.value), change: 'acumulado', icon: 'heart', color: 'var(--amber-600)' },
  ];

  const maxVal = Math.max(...FINANCE.monthlyData);

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Finanzas</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Resumen de métricas financieras</p>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-5)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{m.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={m.icon} size={16} style={{ color: m.color }} />
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>{m.value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 500, marginTop: 4 }}>{m.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-6)' }}>
        {/* MRR chart */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', padding: 'var(--sp-5)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--sp-5)' }}>Evolución MRR</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
            {FINANCE.monthlyData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', background: i === FINANCE.monthlyData.length - 1 ? 'var(--color-primary)' : 'var(--color-primary-subtle)', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', height: `${(val / maxVal) * 140}px`, transition: 'height 0.3s' }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{FINANCE.monthLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', padding: 'var(--sp-5)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--sp-4)' }}>Métricas clave</h2>
          {[
            { label: 'LTV promedio', value: formatCLP(FINANCE.ltvAvg), icon: 'heart' },
            { label: 'Pacientes suscritos', value: `${FINANCE.subscribed}`, icon: 'refresh' },
            { label: 'Tasa de recompra', value: `${FINANCE.reorderRate}%`, icon: 'trendUp', sub: 'vs 45% industria' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-3) 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={item.icon} size={16} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{item.sub}</div>}
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}

          {/* Projections */}
          <div style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-4)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600, marginBottom: 4 }}>Próximos 7 días</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>{formatCLP(FINANCE.projectedNext.total)}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {FINANCE.projectedNext.renewals} renovaciones + {FINANCE.projectedNext.newProtocols} nuevos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
