'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/icon';

const TESTIMONIALS = [
  {
    name: 'Dra. Valentina Herrera',
    role: 'Nutricionista Clínica · Santiago',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&auto=format&fit=crop&q=80',
    text: 'Antes pasaba 20 minutos explicando cada suplemento. Ahora envío el link y mis pacientes compran en 2 minutos con todo explicado.',
  },
  {
    name: 'Dr. Andrés Molina',
    role: 'Médico Internista · Viña del Mar',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&auto=format&fit=crop&q=80',
    text: 'La adherencia de mis pacientes mejoró notablemente. Ver el protocolo personalizado con su nombre hace toda la diferencia.',
  },
  {
    name: 'Natalia Campos',
    role: 'Nutricionista Deportiva · Concepción',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
    text: 'Las comisiones me generan un ingreso extra sin esfuerzo adicional. Y mis deportistas tienen todo en un solo lugar.',
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav style={{
        padding: '16px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'rgba(248,250,252,0.95)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--green-500), var(--teal-600))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
          }}>
            <Icon name="heart" size={18} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-0.03em' }}>NutriLink</span>
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
              background: 'linear-gradient(135deg, var(--green-600), var(--teal-600))',
              padding: '8px 18px', borderRadius: 'var(--radius-md)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
            }}
          >
            <Icon name="user-plus" size={14} style={{ color: '#fff' }} />
            Registrarse gratis
          </Link>
        </div>
      </nav>

      {/* ── Hero — Split Layout ───────────────────────────────── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '88vh',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        padding: '0 40px',
        gap: 56,
        alignItems: 'center',
      }}>
        {/* Left: Copy */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--emerald-50)', border: '1px solid var(--emerald-100)',
            borderRadius: 'var(--radius-full)', padding: '6px 16px',
            fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--green-700)',
            marginBottom: 28, letterSpacing: '0.02em', width: 'fit-content',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green-500)', display: 'inline-block', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
            Plataforma activa en Chile
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 3.8vw, 3.5rem)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.06,
            marginBottom: 24,
          }}>
            Suplementación
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--green-600), var(--teal-500))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              inteligente
            </span>
            <br />
            y personalizada
          </h1>

          <p style={{
            fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)',
            lineHeight: 1.7, marginBottom: 40, maxWidth: 480,
          }}>
            La plataforma que conecta nutricionistas con sus pacientes para recomendar, comprar y hacer seguimiento de protocolos de suplementación.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
            <Link
              href="/login?role=professional&mode=register"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '15px 28px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--green-600), var(--teal-600))',
                color: '#fff', fontSize: 'var(--text-md)', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(5,150,105,0.35)',
              }}
            >
              <Icon name="user-plus" size={17} style={{ color: '#fff' }} />
              Soy nutricionista — Registro gratis
            </Link>
            <Link
              href="/login?role=patient&mode=login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '15px 24px', borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface)', color: 'var(--color-text)',
                border: '1.5px solid var(--color-border)',
                fontSize: 'var(--text-md)', fontWeight: 600, textDecoration: 'none',
              }}
            >
              <Icon name="user" size={17} style={{ color: 'var(--color-text-secondary)' }} />
              Soy paciente
            </Link>
          </div>

          {/* Social proof mini */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {[
                'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&auto=format&fit=crop&q=80',
              ].map((src, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '2px solid #fff',
                  marginLeft: i > 0 ? -10 : 0,
                  overflow: 'hidden', position: 'relative',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <Image src={src} alt="Profesional" fill style={{ objectFit: 'cover' }} sizes="32px" />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Profesionales de la salud<br />ya usan NutriLink
            </p>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div style={{ position: 'relative', height: 580 }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: 'var(--radius-2xl)',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(15,23,42,0.16), 0 8px 24px rgba(15,23,42,0.08)',
          }}>
            <Image
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&auto=format&fit=crop&q=85"
              alt="Profesional de salud usando NutriLink"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 50%, rgba(15,23,42,0.4) 100%)',
            }} />
          </div>

          {/* Floating card — protocol preview */}
          <div style={{
            position: 'absolute', bottom: 28, left: -28,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 20px',
            boxShadow: '0 12px 40px rgba(15,23,42,0.15)',
            border: '1px solid var(--color-border-subtle)',
            width: 260,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--emerald-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="fileText" size={18} style={{ color: 'var(--green-600)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)' }}>Protocolo activo</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>María González</p>
              </div>
            </div>
            {[
              { name: 'Omega-3 EPA/DHA', dose: '2g / día' },
              { name: 'Vitamina D3', dose: '2000 UI / día' },
              { name: 'Magnesio Bisglicinato', dose: '300mg / noche' },
            ].map(item => (
              <div key={item.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 0', borderBottom: '1px solid var(--color-border-subtle)',
              }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--green-600)', fontWeight: 600 }}>{item.dose}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--green-600)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#fff' }}>Comprar protocolo · $38.500</span>
            </div>
          </div>

          {/* Floating badge — comisión */}
          <div style={{
            position: 'absolute', top: 28, right: -20,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-xl)',
            padding: '12px 18px',
            boxShadow: '0 8px 30px rgba(15,23,42,0.12)',
            border: '1px solid var(--color-border-subtle)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--amber-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="trendUp" size={18} style={{ color: 'var(--amber-600)' }} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Comisión del mes</p>
              <p style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--color-text)' }}>$124.300</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats / Trust ────────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'var(--color-surface)',
        padding: '32px 24px',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { value: 'Gratuito', label: 'Para profesionales de salud' },
            { value: 'Flow', label: 'Pago seguro certificado' },
            { value: 'Chile', label: 'Plataforma local, en español' },
            { value: '100%', label: 'Protocolos personalizados' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              flex: '1 1 200px', textAlign: 'center', padding: '16px 24px',
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
      <section style={{ padding: '96px 24px', textAlign: 'center', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em',
            color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 12,
          }}>
            Cómo funciona
          </p>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16,
          }}>
            Tres pasos para conectar<br />profesional y paciente
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', maxWidth: 460, margin: '0 auto 64px', lineHeight: 1.7 }}>
            Sin papeleos, sin intermediarios. El profesional diseña, el paciente compra.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              {
                step: '01',
                icon: 'fileText',
                title: 'El nutricionista crea el protocolo',
                desc: 'Selecciona productos del catálogo, configura dosis y genera un link único personalizado para cada paciente.',
                color: 'var(--color-primary)',
                bg: 'linear-gradient(135deg, var(--green-50), var(--emerald-50))',
                border: 'var(--green-100)',
                img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=480&auto=format&fit=crop&q=80',
              },
              {
                step: '02',
                icon: 'link',
                title: 'El paciente recibe el link',
                desc: 'Con un click ve exactamente qué comprar, cuánto tomar y por qué — sin necesidad de crear cuenta.',
                color: 'var(--blue-600)',
                bg: 'linear-gradient(135deg, var(--blue-50), #EFF6FF)',
                border: 'var(--blue-100)',
                img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=480&auto=format&fit=crop&q=80',
              },
              {
                step: '03',
                icon: 'trendUp',
                title: 'Compra, seguimiento y comisiones',
                desc: 'El paciente paga con Flow de forma segura. El profesional recibe comisión y monitorea adherencia.',
                color: 'var(--amber-600)',
                bg: 'linear-gradient(135deg, var(--amber-50), #FFFBEB)',
                border: 'var(--amber-100)',
                img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=480&auto=format&fit=crop&q=80',
              },
            ].map((s) => (
              <div key={s.step} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, transparent 30%, rgba(15,23,42,0.5) 100%)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 14, left: 14,
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '4px 10px',
                    fontSize: 'var(--text-xs)', fontWeight: 800,
                    color: '#fff', letterSpacing: '0.04em',
                  }}>
                    Paso {s.step}
                  </div>
                </div>
                <div style={{ padding: '20px 20px 24px', textAlign: 'left', flex: 1 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                    border: `1px solid ${s.border}`,
                  }}>
                    <Icon name={s.icon} size={18} style={{ color: s.color }} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimoniales ─────────────────────────────────────── */}
      <section style={{ background: 'var(--slate-900)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em',
            color: 'var(--green-400)', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center',
          }}>
            Testimonios
          </p>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800,
            letterSpacing: '-0.03em', color: '#fff', textAlign: 'center', marginBottom: 56,
          }}>
            Lo que dicen los profesionales
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{
                background: 'var(--slate-800)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px 24px',
                border: '1px solid var(--slate-700)',
                display: 'flex', flexDirection: 'column', gap: 20,
              }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--amber-500)', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-300)', lineHeight: 1.7, flex: 1 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    overflow: 'hidden', position: 'relative', flexShrink: 0,
                    border: '2px solid var(--slate-600)',
                  }}>
                    <Image src={t.avatar} alt={t.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff' }}>{t.name}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cards de rol ─────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em',
            color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center',
          }}>
            Elige tu acceso
          </p>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800,
            letterSpacing: '-0.025em', marginBottom: 48, textAlign: 'center',
          }}>
            ¿Eres profesional o paciente?
          </h2>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>

            {/* Nutricionista */}
            <div style={{
              flex: '1 1 320px', maxWidth: 380,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(5,150,105,0.15)',
            }}>
              <div style={{ position: 'relative', height: 160 }}>
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80"
                  alt="Nutricionista"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  sizes="380px"
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(5,150,105,0.2) 0%, rgba(5,150,105,0.6) 100%)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 14, left: 16,
                  fontSize: 'var(--text-xs)', fontWeight: 800,
                  color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  Para profesionales
                </div>
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
                  Soy Nutricionista
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, margin: '0 0 20px', padding: 0 }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/login?role=professional&mode=register" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '12px 20px', borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--green-600), var(--teal-600))',
                    color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 700, textDecoration: 'none',
                    boxShadow: '0 3px 12px rgba(5,150,105,0.3)',
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
            </div>

            {/* Paciente */}
            <div style={{
              flex: '1 1 320px', maxWidth: 380,
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ position: 'relative', height: 160 }}>
                <Image
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
                  alt="Persona saludable con suplementos"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                  sizes="380px"
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.55) 100%)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 14, left: 16,
                  fontSize: 'var(--text-xs)', fontWeight: 800,
                  color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  Para pacientes
                </div>
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
                  Soy Paciente
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, margin: '0 0 16px', padding: 0 }}>
                  {[
                    'Recibe tu protocolo personalizado',
                    'Compra directamente con un click',
                    'Paga con Flow de forma segura',
                    'Consulta con NutriGuía IA',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      <Icon name="check" size={14} style={{ color: 'var(--emerald-600)', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{
                  background: 'var(--color-bg)', borderRadius: 'var(--radius-md)',
                  padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10,
                  fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-subtle)', lineHeight: 1.5, marginBottom: 16,
                }}>
                  <Icon name="info" size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: 1 }} />
                  Tu nutricionista te enviará un link personalizado. No necesitas cuenta para comprar.
                </div>
                <Link href="/login?role=patient&mode=login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '12px 20px', borderRadius: 'var(--radius-md)',
                  background: 'var(--emerald-600)', color: '#fff',
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

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 2.5vw, 1.875rem)', fontWeight: 800,
            letterSpacing: '-0.025em', marginBottom: 40, textAlign: 'center',
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
                padding: '22px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 8 }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final con imagen de fondo ────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1400&auto=format&fit=crop&q=80"
            alt="Fondo saludable"
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(5,150,105,0.92) 0%, rgba(8,145,178,0.9) 100%)',
          }} />
        </div>
        <div style={{ position: 'relative', padding: '88px 24px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.03em', marginBottom: 16,
          }}>
            Empieza hoy — es gratis
          </h2>
          <p style={{
            fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.85)',
            marginBottom: 36, maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            Únete a los profesionales que ya usan NutriLink para digitalizar sus protocolos.
          </p>
          <Link href="/login?role=professional&mode=register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 36px', borderRadius: 'var(--radius-md)',
            background: '#fff', color: 'var(--color-primary)',
            fontSize: 'var(--text-md)', fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          }}>
            <Icon name="user-plus" size={17} style={{ color: 'var(--color-primary)' }} />
            Crear cuenta gratuita
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--slate-900)',
        padding: '48px 32px 32px',
        color: 'var(--slate-400)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', marginBottom: 40, justifyContent: 'space-between' }}>
            <div style={{ flex: '1 1 220px', maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'linear-gradient(135deg, var(--green-500), var(--teal-600))',
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
                <a href="mailto:soporte@nutrilink.cl" style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', textDecoration: 'none' }}>
                  soporte@nutrilink.cl
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--slate-800)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-600)' }}>© 2025 NutriLink SpA · Santiago, Chile</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-600)' }}>La información no reemplaza el criterio de tu profesional de salud</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
