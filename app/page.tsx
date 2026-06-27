'use client';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';

/* ─────────────────────────────────────────────────────────────
   NutriLink Landing Page
   Mejoras:
   - CTAs primarios visibles en el hero (sin scroll)
   - Sección "Cómo funciona" con 3 pasos
   - Sección de stats/trust
   - Footer completo con links legales
───────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav style={{
        padding: '16px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'rgba(248,250,252,0.92)', backdropFilter: 'blur(8px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="heart" size={18} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/login?role=professional&mode=login"
            style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/login?role=professional&mode=register"
            style={{
              fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff', textDecoration: 'none',
              background: 'var(--color-primary)', padding: '8px 16px',
              borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Icon name="user-plus" size={14} style={{ color: '#fff' }} />
            Registrarse gratis
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '72px 24px 80px', textAlign: 'center',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--emerald-50, #ecfdf5)', border: '1px solid var(--emerald-200, #a7f3d0)',
          borderRadius: 'var(--radius-full)', padding: '5px 14px',
          fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--emerald-700, #047857)',
          marginBottom: 28, letterSpacing: '0.02em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald-500, #10b981)', display: 'inline-block' }} />
          Plataforma activa en Chile
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 3.75rem)',
          fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.08,
          marginBottom: 20, maxWidth: 700,
        }}>
          Suplementación inteligente,<br />
          <span style={{ color: 'var(--color-primary)' }}>personalizada por tu profesional</span>
        </h1>

        <p style={{
          fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)',
          maxWidth: 500, lineHeight: 1.65, marginBottom: 40,
        }}>
          La plataforma que conecta nutricionistas con sus pacientes para recomendar, comprar y hacer seguimiento de protocolos de suplementación.
        </p>

        {/* ── Hero CTAs — VISIBLES SIN SCROLL ─────────────────── */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
          <Link
            href="/login?role=professional&mode=register"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)', color: '#fff',
              fontSize: 'var(--text-md)', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(5,150,105,0.35)',
              transition: 'opacity 0.15s',
            }}
          >
            <Icon name="user-plus" size={17} style={{ color: '#fff' }} />
            Soy nutricionista — Registro gratis
          </Link>
          <Link
            href="/login?role=patient&mode=login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)', color: 'var(--color-text)',
              border: '1.5px solid var(--color-border)',
              fontSize: 'var(--text-md)', fontWeight: 600, textDecoration: 'none',
            }}
          >
            <Icon name="user" size={17} style={{ color: 'var(--color-text-secondary)' }} />
            Soy paciente
          </Link>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          Sin tarjeta de crédito · Cuenta gratuita para profesionales
        </p>
      </section>

      {/* ── Stats / Trust ────────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'var(--color-surface)',
        padding: '28px 24px',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { value: 'Gratuito', label: 'Para profesionales de salud' },
            { value: 'Flow', label: 'Pago seguro certificado' },
            { value: 'Chile', label: 'Plataforma local, en español' },
            { value: '100%', label: 'Protocolos personalizados' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              flex: '1 1 200px', textAlign: 'center', padding: '12px 24px',
              borderRight: i < 3 ? '1px solid var(--color-border-subtle)' : 'none',
            }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cómo funciona ────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em',
            color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 12,
          }}>
            Cómo funciona
          </p>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800,
            letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 16,
          }}>
            Tres pasos para conectar profesional y paciente
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto 56px', lineHeight: 1.65 }}>
            Sin papeleos, sin intermediarios. El profesional diseña, el paciente compra.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                step: '01',
                icon: 'fileText',
                title: 'El nutricionista crea el protocolo',
                desc: 'Selecciona productos del catálogo, configura dosis y genera un link único personalizado para cada paciente.',
                color: 'var(--color-primary)',
                bg: 'var(--color-primary-light)',
              },
              {
                step: '02',
                icon: 'link',
                title: 'El paciente recibe el link',
                desc: 'Con un click ve exactamente qué comprar, cuánto tomar y por qué — sin necesidad de crear cuenta.',
                color: 'var(--blue-600)',
                bg: 'var(--blue-50)',
              },
              {
                step: '03',
                icon: 'trendUp',
                title: 'Compra, seguimiento y comisiones',
                desc: 'El paciente paga con Flow de forma segura. El profesional recibe comisión y monitorea adherencia.',
                color: 'var(--amber-600)',
                bg: 'var(--amber-50)',
              },
            ].map((s) => (
              <div key={s.step} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px 24px',
                textAlign: 'left',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                    background: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon name={s.icon} size={22} style={{ color: s.color }} />
                  </div>
                  <span style={{
                    fontSize: 'var(--text-xs)', fontWeight: 800,
                    color: s.color, letterSpacing: '0.05em',
                  }}>Paso {s.step}</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 10, lineHeight: 1.35 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cards de rol ─────────────────────────────────────── */}
      <section style={{ padding: '16px 24px 80px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em',
            color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center',
          }}>
            Elige tu acceso
          </p>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800,
            letterSpacing: '-0.025em', marginBottom: 40, textAlign: 'center',
          }}>
            ¿Eres profesional o paciente?
          </h2>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>

            {/* Nutricionista */}
            <div style={{
              flex: '1 1 300px', maxWidth: 360,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', gap: 20,
              boxShadow: '0 4px 20px rgba(5,150,105,0.12)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name="stethoscope" size={24} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
                  }}>Para profesionales</p>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Soy Nutricionista</h3>
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
                <Link href="/login?role=professional&mode=register" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '12px 20px', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary)', color: '#fff',
                  fontSize: 'var(--text-sm)', fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 3px 10px rgba(5,150,105,0.3)',
                }}>
                  <Icon name="user-plus" size={15} style={{ color: '#fff' }} />
                  Crear cuenta gratis
                </Link>
                <Link href="/login?role=professional&mode=login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px 20px', borderRadius: 'var(--radius-md)',
                  background: 'transparent', color: 'var(--color-primary)',
                  border: '1.5px solid var(--color-primary)',
                  fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none',
                }}>
                  Ya tengo cuenta — Iniciar sesión
                </Link>
              </div>
            </div>

            {/* Paciente */}
            <div style={{
              flex: '1 1 300px', maxWidth: 360,
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  background: 'var(--emerald-50, #ecfdf5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name="user" size={24} style={{ color: 'var(--emerald-600, #059669)' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
                  }}>Para pacientes</p>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Soy Paciente</h3>
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
                background: 'var(--color-bg)', borderRadius: 'var(--radius-md)',
                padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)', lineHeight: 1.5,
              }}>
                <Icon name="info" size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: 1 }} />
                Tu nutricionista te enviará un link personalizado. No necesitas cuenta para comprar tu protocolo.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                <Link href="/login?role=patient&mode=login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '12px 20px', borderRadius: 'var(--radius-md)',
                  background: 'var(--emerald-600, #059669)', color: '#fff',
                  fontSize: 'var(--text-sm)', fontWeight: 700, textDecoration: 'none',
                }}>
                  <Icon name="log-in" size={15} style={{ color: '#fff' }} />
                  Acceder a mi protocolo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ / Dudas frecuentes ────────────────────────────── */}
      <section style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        padding: '64px 24px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 2.5vw, 1.875rem)', fontWeight: 800,
            letterSpacing: '-0.025em', marginBottom: 36, textAlign: 'center',
          }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                q: '¿Cuánto cuesta para el nutricionista?',
                a: 'NutriLink es completamente gratuito para profesionales de la salud. Generamos ingresos a través de una pequeña comisión en cada compra que realizan tus pacientes.',
              },
              {
                q: '¿Los pacientes necesitan crear una cuenta?',
                a: 'No. Los pacientes pueden comprar su protocolo directamente desde el link que les envía su nutricionista, sin necesidad de registrarse.',
              },
              {
                q: '¿Cómo se procesan los pagos?',
                a: 'Los pagos se procesan de forma segura a través de Flow, el procesador de pagos líder en Chile. Aceptamos tarjetas de crédito, débito y transferencias.',
              },
              {
                q: '¿Mis datos y los de mis pacientes están seguros?',
                a: 'Sí. Cumplimos con la ley 19.628 de protección de datos personales de Chile. Los datos se almacenan con cifrado y nunca compartimos información con terceros.',
              },
            ].map((faq, i, arr) => (
              <div key={faq.q} style={{
                padding: '20px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-primary)',
        padding: '64px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800,
          color: '#fff', letterSpacing: '-0.025em', marginBottom: 16,
        }}>
          Empieza hoy — es gratis
        </h2>
        <p style={{
          fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.82)',
          marginBottom: 32, maxWidth: 460, margin: '0 auto 32px',
        }}>
          Únete a los profesionales que ya usan NutriLink para digitalizar sus protocolos.
        </p>
        <Link href="/login?role=professional&mode=register" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '14px 32px', borderRadius: 'var(--radius-md)',
          background: '#fff', color: 'var(--color-primary)',
          fontSize: 'var(--text-md)', fontWeight: 800, textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <Icon name="user-plus" size={17} style={{ color: 'var(--color-primary)' }} />
          Crear cuenta gratuita
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--slate-900)',
        padding: '48px 32px 32px',
        color: 'var(--slate-400)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', marginBottom: 40, justifyContent: 'space-between' }}>

            {/* Brand */}
            <div style={{ flex: '1 1 220px', maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="heart" size={15} style={{ color: '#fff' }} />
                </div>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: '#fff' }}>NutriLink</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', lineHeight: 1.65, color: 'var(--slate-500)' }}>
                La plataforma que conecta profesionales de la salud con sus pacientes para gestionar protocolos de suplementación.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--slate-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Plataforma
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Para nutricionistas', href: '/login?role=professional&mode=register' },
                    { label: 'Para pacientes', href: '/login?role=patient&mode=login' },
                    { label: 'Iniciar sesión', href: '/login' },
                  ].map(link => (
                    <Link key={link.label} href={link.href} style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', textDecoration: 'none' }}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--slate-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Legal
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Términos de Servicio', href: '/terms' },
                    { label: 'Política de Privacidad', href: '/privacy' },
                    { label: 'Ley 19.628 (Chile)', href: '/privacy' },
                  ].map(link => (
                    <Link key={link.label} href={link.href} style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', textDecoration: 'none' }}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--slate-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  Contacto
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="mailto:soporte@nutrilink.cl" style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', textDecoration: 'none' }}>
                    soporte@nutrilink.cl
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--slate-800)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-600)' }}>
              © 2025 NutriLink SpA · Santiago, Chile
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-600)' }}>
              La información no reemplaza el criterio de tu profesional de salud
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
