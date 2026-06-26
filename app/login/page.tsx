'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

type Role = 'professional' | 'patient';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role') as Role | null;

  const [role, setRole] = useState<Role>(roleParam === 'patient' ? 'patient' : 'professional');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (roleParam === 'patient' || roleParam === 'professional') setRole(roleParam);
  }, [roleParam]);

  async function handleLogin() {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email o contraseña incorrectos.');
      setLoading(false);
    } else {
      const userRole = data.user?.user_metadata?.role;
      const dest = userRole === 'admin' ? '/admin/dashboard' : userRole === 'patient' ? '/patient/dashboard' : '/dashboard';
      router.push(dest);
      router.refresh();
    }
  }

  const isProfessional = role === 'professional';

  const primaryColor = isProfessional ? 'var(--color-primary)' : 'var(--emerald-600, #059669)';
  const accentBg = isProfessional ? 'var(--color-primary-light, #e0f2fe)' : 'var(--emerald-50, #ecfdf5)';

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>

      {/* Back */}
      <Link href="/" style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
        <Icon name="arrow-left" size={15} style={{ color: 'var(--color-text-tertiary)' }} />
        Inicio
      </Link>

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeInUp var(--duration-enter) var(--ease-out) both' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" size={20} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
        </div>

        {/* Role Toggle */}
        <div style={{
          display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24,
        }}>
          {([
            { key: 'professional', label: 'Nutricionista', icon: 'stethoscope' },
            { key: 'patient', label: 'Paciente', icon: 'user' },
          ] as { key: Role; label: string; icon: string }[]).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setRole(key); setError(''); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 16px', borderRadius: 'var(--radius-md)',
                background: role === key ? (key === 'professional' ? 'var(--color-primary)' : 'var(--emerald-600, #059669)') : 'transparent',
                color: role === key ? '#fff' : 'var(--color-text-secondary)',
                border: 'none', fontSize: 'var(--text-sm)', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}
            >
              <Icon name={icon as any} size={14} style={{ color: role === key ? '#fff' : 'var(--color-text-tertiary)' }} />
              {label}
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--sp-8)', boxShadow: 'var(--shadow-lg)' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--sp-6)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={isProfessional ? 'stethoscope' : 'user'} size={20} style={{ color: primaryColor }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {isProfessional ? 'Acceso profesional' : 'Acceso paciente'}
              </h1>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {isProfessional ? 'Dashboard de protocolos y finanzas' : 'Tu historial de planes y pedidos'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <Input label="Email" type="email" placeholder="tu@email.cl" value={email} onChange={setEmail} icon="mail" />
            <Input label="Contraseña" type="password" placeholder="••••••••" value={password} onChange={setPassword} icon="shield" />
          </div>

          {error && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '10px 12px', marginTop: 'var(--sp-3)' }}>
              {error}
            </p>
          )}

          <Button
            onClick={handleLogin}
            disabled={!email || !password}
            loading={loading}
            style={{
              width: '100%', marginTop: 'var(--sp-5)', justifyContent: 'center',
              background: primaryColor,
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>

          {/* Demo credentials hint */}
          {isProfessional && (
            <div style={{ marginTop: 'var(--sp-4)', padding: '10px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Demo:</strong> demo@nutrilink.cl · Nutrilink2024!
              </p>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 20 }}>
          ¿No tienes cuenta?{' '}
          <Link href={`/register?role=${role}`} style={{ color: primaryColor, fontWeight: 700, textDecoration: 'none' }}>
            Crear cuenta
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
