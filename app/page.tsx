import Link from 'next/link';
import { Icon } from '@/components/ui/icon';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" size={18} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
        </div>
        <Link href="/login" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
          Iniciar sesión
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 64px', textAlign: 'center' }}>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--emerald-50, #ecfdf5)', border: '1px solid var(--emerald-200, #a7f3d0)',
          borderRadius: 'var(--radius-full)', padding: '4px 12px',
          fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--emerald-700, #047857)',
          marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald-500, #10b981)', display: 'inline-block' }} />
          Plataforma activa en Chile
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 20,
          maxWidth: 640,
        }}>
          Suplementación inteligente,<br />
          <span style={{ color: 'var(--color-primary)' }}>personalizada por tu profesional</span>
        </h1>

        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', maxWidth: 520, lineHeight: 1.6, marginBottom: 48 }}>
          NutriLink conecta a profesionales de la salud con sus pacientes para recomendar, comprar y hacer seguimiento de protocolos de suplementación.
        </p>

        {/* Role Cards */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 720 }}>

          {/* Profesional */}
          <div style={{
            flex: '1 1 300px', maxWidth: 340,
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 28px',
            display: 'flex', flexDirection: 'column', gap: 20,
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-light, #e0f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="stethoscope" size={24} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Para profesionales</p>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Soy Nutricionista</h2>
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0 }}>
              {[
                'Crea protocolos personalizados',
                'Comparte links directos a tus pacientes',
                'Gana comisiones por cada compra',
                'Monitorea adherencia y pagos',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  <Icon name="check" size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
              <Link
                href="/login?role=professional&mode=login"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '11px 20px', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary)', color: '#fff',
                  fontSize: 'var(--text-sm)', fontWeight: 700, textDecoration: 'none',
                }}
              >
                <Icon name="log-in" size={15} style={{ color: '#fff' }} />
                Iniciar sesión
              </Link>
              <Link
                href="/login?role=professional&mode=register"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '11px 20px', borderRadius: 'var(--radius-md)',
                  background: 'transparent', color: 'var(--color-primary)',
                  border: '1.5px solid var(--color-primary)',
                  fontSize: 'var(--text-sm)', fontWeight: 700, textDecoration: 'none',
                }}
              >
                <Icon name="user-plus" size={15} style={{ color: 'var(--color-primary)' }} />
                Crear cuenta gratis
              </Link>
            </div>
          </div>

          {/* Paciente */}
          <div style={{
            flex: '1 1 300px', maxWidth: 340,
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 28px',
            display: 'flex', flexDirection: 'column', gap: 20,
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--emerald-400, #34d399)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--emerald-50, #ecfdf5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="user" size={24} style={{ color: 'var(--emerald-600, #059669)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Para pacientes</p>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Soy Paciente</h2>
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0 }}>
              {[
                'Recibe tu protocolo personalizado',
                'Compra directamente con un click',
                'Paga con Flow de forma segura',
                'Consulta con NutriGuía IA',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  <Icon name="check" size={14} style={{ color: 'var(--emerald-600, #059669)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>

            <div style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-subtle)',
            }}>
              <Icon name="link" size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
              Tu nutricionista te enviará un link personalizado para comprar tu plan.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
              <Link
                href="/login?role=patient&mode=login"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '11px 20px', borderRadius: 'var(--radius-md)',
                  background: 'var(--emerald-600, #059669)', color: '#fff',
                  fontSize: 'var(--text-sm)', fontWeight: 700, textDecoration: 'none',
                }}
              >
                <Icon name="log-in" size={15} style={{ color: '#fff' }} />
                Iniciar sesión
              </Link>
              <Link
                href="/login?role=patient&mode=register"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '11px 20px', borderRadius: 'var(--radius-md)',
                  background: 'transparent', color: 'var(--emerald-600, #059669)',
                  border: '1.5px solid var(--emerald-400, #34d399)',
                  fontSize: 'var(--text-sm)', fontWeight: 700, textDecoration: 'none',
                }}
              >
                <Icon name="user-plus" size={15} style={{ color: 'var(--emerald-600, #059669)' }} />
                Crear cuenta gratis
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '20px 32px', textAlign: 'center', borderTop: '1px solid var(--color-border-subtle)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          © 2024 NutriLink · La información no reemplaza el criterio de tu profesional de salud
        </p>
      </footer>

    </div>
  );
}
