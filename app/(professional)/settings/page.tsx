import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PROFESSIONAL } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Ajustes</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Configura tu perfil y preferencias</p>
      </div>

      {/* Profile card */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', padding: 'var(--sp-6)', marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
          <Avatar name={PROFESSIONAL.name} size={64} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{PROFESSIONAL.name}</h2>
              {PROFESSIONAL.verified && <Badge color="emerald">Verificada</Badge>}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{PROFESSIONAL.specialty} · {PROFESSIONAL.focus}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>Reg. CSN: {PROFESSIONAL.collegeReg}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
          {[
            { label: 'Email', value: PROFESSIONAL.email },
            { label: 'Teléfono', value: PROFESSIONAL.phone ?? '—' },
            { label: 'Modo de margen', value: PROFESSIONAL.marginMode === 'transfer_to_patient' ? 'Transferir al paciente' : 'Absorber' },
            { label: 'Porcentaje de margen', value: `${PROFESSIONAL.marginPct}%` },
          ].map(field => (
            <div key={field.label}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontWeight: 500 }}>{field.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--sp-5)', display: 'flex', gap: 'var(--sp-3)' }}>
          <Button variant="secondary" icon="settings">Editar perfil</Button>
          <Button variant="ghost" icon="logout">Cerrar sesión</Button>
        </div>
      </div>

      {/* Integrations placeholder */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', padding: 'var(--sp-6)' }}>
        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--sp-4)' }}>Integraciones</h3>
        {['WhatsApp Business', 'Webpay / Transbank', 'Email (SendGrid)'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-3) 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item}</span>
            <Badge color="amber">Próximamente</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
