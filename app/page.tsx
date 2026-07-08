'use client';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { useState } from 'react';

const FEATURES = [
  {
    icon: 'clipboardList',
    title: 'Protocolos personalizados',
    desc: 'Crea planes de suplementación a medida en minutos con un catálogo curado de productos de calidad.',
  },
  {
    icon: 'dollarSign',
    title: 'Comisión transparente',
    desc: 'Recibe ingresos claros por cada protocolo adquirido, sin letra pequeña ni sorpresas.',
  },
  {
    icon: 'shield',
    title: 'Confianza y seguridad',
    desc: 'Plataforma profesional con aviso claro de apoyo a la salud, nunca tratamiento médico.',
  },
  {
    icon: 'trendUp',
    title: 'Panel de seguimiento',
    desc: 'Visualiza ingresos, protocolos activos y pacientes desde un único panel intuitivo.',
  },
];

const STEPS = [
  { num: '01', title: 'Crea el protocolo', desc: 'Selecciona productos del catálogo y personaliza las indicaciones para tu paciente.' },
  { num: '02', title: 'Comparte el enlace', desc: 'El paciente recibe un enlace único con su plan de suplementación profesional.' },
  { num: '03', title: 'Recibe tu comisión', desc: 'Cuando el paciente adquiere el protocolo, tu ingreso se acredita de forma transparente.' },
];

const STATS = [
  { icon: 'users', value: '120+', label: 'Profesionales activos' },
  { icon: 'clipboardList', value: '1,800+', label: 'Protocolos creados' },
  { icon: 'dollarSign', value: '$45M+', label: 'Ingresos generados' },
  { icon: 'trendUp', value: '68%', label: 'Tasa de conversión' },
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, var(--green-500), var(--teal-600))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(5,150,105,0.3)', flexShrink: 0,
      }}>
        <Icon name="heart" size={18} style={{ color: '#fff' }} />
      </div>
      <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-0.03em', color: light ? '#fff' : 'var(--color-text)' }}>VitaLink</span>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'rgba(248,250,252,0.95)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1152, margin: '0 auto', padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo /></Link>

          <nav style={{ display: 'none', alignItems: 'center', gap: 28 }} className="nl-desktop-nav">
            <a href="#features" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Características</a>
            <a href="#como-funciona" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Cómo funciona</a>
            <Link href="/p/demo" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Ver demo</Link>
          </nav>

          <div style={{ display: 'none', alignItems: 'center', gap: 12 }} className="nl-desktop-nav">
            <Link href="/login?role=professional&mode=login" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Iniciar sesión</Link>
            <Link
              href="/login?role=professional&mode=register"
              style={{
                fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff', textDecoration: 'none',
                background: 'linear-gradient(135deg, var(--green-600), var(--teal-600))',
                padding: '8px 18px', borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
              }}
            >
              Empezar gratis
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Abrir menú"
            style={{ display: 'flex', padding: 8, borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)' }}
            className="nl-mobile-toggle"
          >
            <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', background: '#fff', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <a href="#features" onClick={() => setMenuOpen(false)} style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Características</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)} style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Cómo funciona</a>
            <Link href="/p/demo" onClick={() => setMenuOpen(false)} style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Ver demo</Link>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/login?role=professional&mode=login" style={{ textAlign: 'center', padding: '10px 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>Iniciar sesión</Link>
              <Link href="/login?role=professional&mode=register" style={{ textAlign: 'center', padding: '10px 0', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--green-600), var(--teal-600))', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 700 }}>Empezar gratis</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(236,253,245,0.6), #fff 60%, #fff)',
        }} />
        <div style={{
          maxWidth: 1152, margin: '0 auto', padding: '64px 24px 96px', position: 'relative',
          display: 'grid', gridTemplateColumns: '1fr', gap: 48,
        }} className="nl-hero-grid">
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--emerald-50)', color: 'var(--green-700)',
              borderRadius: 'var(--radius-full)', padding: '6px 14px',
              fontSize: 'var(--text-xs)', fontWeight: 700,
            }}>
              <Icon name="sparkles" size={13} />
              Plataforma para profesionales de la salud
            </span>

            <h1 style={{
              marginTop: 20, fontFamily: 'var(--font-sans)', fontWeight: 900,
              fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)', lineHeight: 1.1, letterSpacing: '-0.03em',
              color: 'var(--color-text)',
            }}>
              Protocolos de suplementación <span style={{ color: 'var(--green-600)' }}>profesionales</span> en minutos
            </h1>

            <p style={{ marginTop: 20, maxWidth: 480, fontSize: 'var(--text-lg)', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              VitaLink conecta a profesionales de la salud —nutricionistas, médicos, farmacéuticos y más— con sus pacientes mediante planes de suplementación personalizados. Crea, comparte y gestiona protocolos con total transparencia.
            </p>

            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/login?role=professional&mode=register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, var(--green-600), var(--teal-600))',
                color: '#fff', fontWeight: 700, fontSize: 'var(--text-base)',
                padding: '14px 26px', borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 14px rgba(5,150,105,0.35)',
              }}>
                Crear tu primer protocolo
                <Icon name="chevronRight" size={16} />
              </Link>
              <Link href="/p/demo" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fff', border: '1px solid var(--color-border)',
                color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--text-base)',
                padding: '14px 26px', borderRadius: 'var(--radius-md)',
              }}>
                Ver demo del paciente
              </Link>
            </div>

            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: '10px 24px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={15} style={{ color: 'var(--green-500)' }} /> Sin coste de alta</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={15} style={{ color: 'var(--green-500)' }} /> Comisión transparente</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={15} style={{ color: 'var(--green-500)' }} /> Catálogo curado</span>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                alt="Suplementos alimentarios"
                style={{ height: 420, width: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute', bottom: -20, left: -20,
              borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)',
              background: '#fff', padding: 16, boxShadow: 'var(--shadow-lg)',
            }} className="nl-float-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--emerald-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="trendUp" size={18} style={{ color: 'var(--green-600)' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>+38%</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Conversión de protocolos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, textAlign: 'center' }} className="nl-stats-grid">
          {STATS.map(s => (
            <div key={s.label}>
              <Icon name={s.icon} size={20} style={{ color: 'var(--green-500)', margin: '0 auto' }} />
              <p style={{ marginTop: 8, fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'var(--color-text)' }}>{s.value}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" style={{ maxWidth: 1152, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--emerald-50)', color: 'var(--green-700)',
            borderRadius: 'var(--radius-full)', padding: '6px 14px',
            fontSize: 'var(--text-xs)', fontWeight: 700,
          }}>
            <Icon name="leaf" size={13} /> Características
          </span>
          <h2 style={{ marginTop: 16, fontWeight: 800, fontSize: 'var(--text-4xl)', letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
            Todo lo que necesitas para tu práctica profesional
          </h2>
          <p style={{ marginTop: 12, fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}>
            Una plataforma diseñada para profesionales de la salud que valoran la calidad y la transparencia.
          </p>
        </div>

        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="nl-features-grid">
          {FEATURES.map(f => (
            <div key={f.title} style={{
              padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)',
              background: '#fff', boxShadow: 'var(--shadow-xs)',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--emerald-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={f.icon} size={20} style={{ color: 'var(--green-600)' }} />
              </div>
              <h3 style={{ marginTop: 16, fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>{f.title}</h3>
              <p style={{ marginTop: 8, fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cómo funciona ──────────────────────────────────── */}
      <section id="como-funciona" style={{ background: 'var(--color-bg-subtle)', padding: '48px 0' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', color: 'var(--green-700)', boxShadow: 'var(--shadow-sm)',
              borderRadius: 'var(--radius-full)', padding: '6px 14px',
              fontSize: 'var(--text-xs)', fontWeight: 700,
            }}>
              <Icon name="heart" size={13} /> Cómo funciona
            </span>
            <h2 style={{ marginTop: 16, fontWeight: 800, fontSize: 'var(--text-4xl)', color: 'var(--color-text)' }}>
              Tres pasos hacia un protocolo profesional
            </h2>
          </div>

          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="nl-steps-grid">
            {STEPS.map(s => (
              <div key={s.num} style={{
                position: 'relative', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)',
                background: '#fff', padding: 24, boxShadow: 'var(--shadow-sm)',
              }}>
                <span style={{ fontWeight: 900, fontSize: 'var(--text-4xl)', color: 'var(--green-100)' }}>{s.num}</span>
                <h3 style={{ marginTop: 8, fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>{s.title}</h3>
                <p style={{ marginTop: 8, fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1152, margin: '0 auto', padding: '32px 24px 64px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(135deg, var(--green-600), var(--teal-800))',
          padding: '56px 24px', textAlign: 'center',
        }}>
          <h2 style={{ fontWeight: 800, fontSize: 'var(--text-4xl)', color: '#fff' }}>
            Empieza a crear protocolos hoy
          </h2>
          <p style={{ margin: '12px auto 0', maxWidth: 480, fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.8)' }}>
            Únete a más de 120 profesionales que ya gestionan su apoyo a la salud con VitaLink.
          </p>
          <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            <Link href="/login?role=professional&mode=register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', color: 'var(--green-700)', fontWeight: 700, fontSize: 'var(--text-base)',
              padding: '14px 24px', borderRadius: 'var(--radius-md)',
            }}>
              Crear cuenta gratuita
              <Icon name="chevronRight" size={16} />
            </Link>
            <Link href="/p/demo" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: 'var(--text-base)',
              padding: '14px 24px', borderRadius: 'var(--radius-md)',
            }}>
              Ver demo del paciente
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--color-border-subtle)', background: '#fff' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <Logo />
              <p style={{ marginTop: 12, maxWidth: 320, fontSize: 'var(--text-xs)', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                Plataforma de protocolos de suplementación para profesionales de la salud. Apoyo a la salud transparente.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px 24px', fontSize: 'var(--text-sm)' }}>
              <Link href="/p/demo" style={{ color: 'var(--color-text-secondary)' }}>Demo</Link>
              <Link href="/login?role=professional&mode=login" style={{ color: 'var(--color-text-secondary)' }}>Profesionales</Link>
              <Link href="/admin" style={{ color: 'var(--color-text-secondary)' }}>Admin</Link>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                <Icon name="lock" size={13} /> Datos seguros
              </span>
            </div>
          </div>
          <div style={{ marginTop: 32, borderTop: '1px solid var(--color-border-subtle)', paddingTop: 24, textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            © 2026 VitaLink. Los suplementos alimentarios no sustituyen una alimentación variada y equilibrada.
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 900px) {
          .nl-desktop-nav { display: flex !important; }
          .nl-mobile-toggle { display: none !important; }
          .nl-hero-grid { grid-template-columns: 1fr 1fr !important; align-items: center; }
          .nl-stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .nl-features-grid { grid-template-columns: 1fr !important; }
          .nl-steps-grid { grid-template-columns: 1fr !important; }
          .nl-float-card { display: none; }
        }
      `}</style>
    </div>
  );
}
