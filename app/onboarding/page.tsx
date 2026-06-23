'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';

const STEPS = [
  { key: 'profile', icon: 'user', title: 'Completa tu perfil', desc: 'Agrega tu especialidad y datos de contacto.', href: '/settings' },
  { key: 'patient', icon: 'users', title: 'Agrega tu primer paciente', desc: 'Registra a un paciente para comenzar.', href: '/patients' },
  { key: 'protocol', icon: 'fileText', title: 'Crea tu primer protocolo', desc: 'Diseña un plan de suplementación.', href: '/protocols' },
  { key: 'sent', icon: 'send', title: 'Envía el link al paciente', desc: 'Publica el protocolo y comparte el link.', href: '/protocols' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nl_onboarding') ?? '[]');
      setCompleted(new Set(saved));
    } catch {}
  }, []);

  function toggle(key: string) {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      localStorage.setItem('nl_onboarding', JSON.stringify([...next]));
      return next;
    });
  }

  const allDone = STEPS.every(s => completed.has(s.key));

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-6)' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-4)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={20} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {allDone ? '¡Todo listo! 🎉' : 'Primeros pasos'}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {allDone
              ? 'Tu cuenta está configurada. Comienza a crear protocolos.'
              : 'Completa estos pasos para aprovechar NutriLink al máximo.'}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-2)', marginBottom: 'var(--sp-4)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {STEPS.map(s => (
              <div key={s.key} style={{ flex: 1, height: 6, borderRadius: 'var(--radius-full)', background: completed.has(s.key) ? 'var(--color-primary)' : 'var(--color-border)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            {completed.size} de {STEPS.length} completados
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
          {STEPS.map((step, i) => {
            const done = completed.has(step.key);
            return (
              <div key={step.key} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: done ? '1px solid var(--color-primary)' : '1px solid var(--color-border)', padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', animation: `fadeInDown var(--duration-enter) var(--ease-out) ${i * 60}ms both` }}>
                <button
                  onClick={() => toggle(step.key)}
                  style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, border: done ? 'none' : '2px solid var(--color-border)', background: done ? 'var(--color-primary)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {done && <Icon name="check" size={14} style={{ color: '#fff' }} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: done ? 'var(--color-text-secondary)' : 'var(--color-text)', textDecoration: done ? 'line-through' : 'none' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{step.desc}</div>
                </div>
                <a
                  href={step.href}
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Ir →
                </a>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          style={{ width: '100%', padding: 'var(--sp-3)', background: allDone ? 'var(--color-primary)' : 'var(--color-surface)', color: allDone ? '#fff' : 'var(--color-text-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {allDone ? 'Ir al dashboard →' : 'Saltar y configurar después'}
        </button>
      </div>
    </div>
  );
}
