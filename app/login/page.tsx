'use client';
import { useState, useEffect, Suspense, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { createClient } from '@/lib/supabase/client';

type Role = 'professional' | 'patient';
type Mode = 'login' | 'register';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role') as Role | null;
  const modeParam = searchParams.get('mode') as Mode | null;

  const [role, setRole] = useState<Role>(roleParam === 'patient' ? 'patient' : 'professional');
  const [mode, setMode] = useState<Mode>(modeParam === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    if (roleParam === 'patient' || roleParam === 'professional') setRole(roleParam);
    if (modeParam === 'login' || modeParam === 'register') setMode(modeParam);
  }, [roleParam, modeParam]);

  function switchMode(m: Mode) { setMode(m); setError(''); }
  function switchRole(r: Role) { setRole(r); setError(''); }

  async function handleLogin() {
    if (!email || !password) { setError('Completa todos los campos'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('Email o contraseña incorrectos.'); setLoading(false); return; }
    const userRole = data.user?.user_metadata?.role;
    const dest = userRole === 'admin' ? '/admin/dashboard' : userRole === 'patient' ? '/patient/dashboard' : '/dashboard';
    router.push(dest);
    router.refresh();
  }

  function handleRegister() {
    if (!name.trim() || !regEmail || !regPassword) { setError('Completa todos los campos obligatorios'); return; }
    if (regPassword.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    startTransition(async () => {
      const supabase = createClient();
      const { data: authData, error: signUpErr } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: { data: { role: role === 'patient' ? 'patient' : 'professional', full_name: name } },
      });
      if (signUpErr || !authData.user) { setError(signUpErr?.message ?? 'Error al crear la cuenta'); return; }
      if (role === 'professional') {
        await supabase.from('professionals').insert({
          user_id: authData.user.id,
          full_name: name.trim(),
          profession: 'Nutricionista',
          specialty: specialty.trim() || null,
          verification_status: 'pending',
        });
        router.replace('/onboarding');
      } else {
        router.replace('/patient/dashboard');
      }
    });
  }

  const isPro = role === 'professional';
  const primaryColor = isPro ? 'var(--color-primary)' : '#059669';
  const accentBg = isPro ? '#e0f2fe' : '#ecfdf5';

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', background: 'var(--color-bg)',
    color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit',
    boxSizing: 'border-box' as const, outline: 'none',
  };

  const busy = loading || isPending;

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>

      {/* Back */}
      <Link href="/" style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
        <Icon name="arrow-left" size={15} style={{ color: 'var(--color-text-tertiary)' }} />
        Inicio
      </Link>

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" size={20} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: '28px', boxShadow: 'var(--shadow-lg)' }}>

          {/* TAB 1: Iniciar sesión / Registrarme */}
          <div style={{ display: 'flex', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 20 }}>
            {([
              { key: 'login' as Mode, label: 'Iniciar sesión', icon: 'log-in' },
              { key: 'register' as Mode, label: 'Registrarme', icon: 'user-plus' },
            ]).map(({ key, label, icon }) => (
              <button key={key} onClick={() => switchMode(key)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 12px', borderRadius: 'var(--radius-md)',
                background: mode === key ? 'var(--color-surface)' : 'transparent',
                color: mode === key ? 'var(--color-text)' : 'var(--color-text-secondary)',
                border: mode === key ? '1px solid var(--color-border)' : '1px solid transparent',
                fontSize: 'var(--text-sm)', fontWeight: mode === key ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                boxShadow: mode === key ? 'var(--shadow-sm)' : 'none',
              }}>
                <Icon name={icon as any} size={14} style={{ color: mode === key ? 'var(--color-text)' : 'var(--color-text-tertiary)' }} />
                {label}
              </button>
            ))}
          </div>

          {/* TAB 2: Nutricionista / Paciente */}
          <div style={{ display: 'flex', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24 }}>
            {([
              { key: 'professional' as Role, label: 'Nutricionista', icon: 'stethoscope', color: 'var(--color-primary)', bg: accentBg },
              { key: 'patient' as Role, label: 'Paciente', icon: 'user', color: '#059669', bg: '#ecfdf5' },
            ]).map(({ key, label, icon, color, bg }) => (
              <button key={key} onClick={() => switchRole(key)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 12px', borderRadius: 'var(--radius-md)',
                background: role === key ? bg : 'transparent',
                color: role === key ? color : 'var(--color-text-secondary)',
                border: role === key ? `1px solid ${color}30` : '1px solid transparent',
                fontSize: 'var(--text-sm)', fontWeight: role === key ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}>
                <Icon name={icon as any} size={14} style={{ color: role === key ? color : 'var(--color-text-tertiary)' }} />
                {label}
              </button>
            ))}
          </div>

          {/* Header contextual */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
              {mode === 'login'
                ? (isPro ? 'Acceso profesional' : 'Acceso paciente')
                : (isPro ? 'Crear cuenta profesional' : 'Crear cuenta paciente')}
            </h1>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              {mode === 'login'
                ? (isPro ? 'Dashboard de protocolos, pacientes y finanzas' : 'Revisa tus planes y pedidos activos')
                : (isPro ? 'Comienza a crear y compartir protocolos' : 'Accede a tu plan de suplementación')}
            </p>
          </div>

          {/* ─── FORMULARIO LOGIN ─── */}
          {mode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 6 }}>Email</label>
                <input type="email" placeholder={isPro ? 'nutricionista@email.cl' : 'paciente@email.cl'} value={email} onChange={e => { setEmail(e.target.value); setError(''); }} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 6 }}>Contraseña</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inputStyle} />
              </div>

              {error && <div style={{ padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: '#b91c1c' }}>{error}</div>}

              <button onClick={handleLogin} disabled={busy} style={{
                width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
                background: busy ? 'var(--color-border)' : primaryColor,
                color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 700,
                border: 'none', cursor: busy ? 'wait' : 'pointer', fontFamily: 'inherit',
                marginTop: 4,
              }}>
                {busy ? 'Entrando...' : 'Iniciar sesión'}
              </button>

              {/* Demo hint */}
              {isPro && (
                <div style={{ padding: '10px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-text-secondary)' }}>Demo:</strong> demo@nutrilink.cl · Nutrilink2024!
                </div>
              )}
            </div>
          )}

          {/* ─── FORMULARIO REGISTRO ─── */}
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 6 }}>
                  {isPro ? 'Nombre completo *' : 'Tu nombre *'}
                </label>
                <input placeholder={isPro ? 'Ej: Dra. Carmen Silva' : 'Tu nombre'} value={name} onChange={e => { setName(e.target.value); setError(''); }} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 6 }}>Email *</label>
                <input type="email" placeholder="tu@email.com" value={regEmail} onChange={e => { setRegEmail(e.target.value); setError(''); }} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 6 }}>Contraseña *</label>
                <input type="password" placeholder="Mínimo 8 caracteres" value={regPassword} onChange={e => { setRegPassword(e.target.value); setError(''); }} style={inputStyle} />
              </div>
              {isPro && (
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 6 }}>Especialidad</label>
                  <input placeholder="Ej: Nutrición deportiva" value={specialty} onChange={e => setSpecialty(e.target.value)} style={inputStyle} />
                </div>
              )}

              {!isPro && (
                <div style={{ padding: '10px 12px', background: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0', fontSize: 'var(--text-xs)', color: '#065f46', lineHeight: 1.5, display: 'flex', gap: 8 }}>
                  <Icon name="info" size={13} style={{ color: '#059669', flexShrink: 0, marginTop: 1 }} />
                  Tu nutricionista te enviará un link con tu plan personalizado para comprarlo directamente.
                </div>
              )}

              {error && <div style={{ padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: '#b91c1c' }}>{error}</div>}

              <button onClick={handleRegister} disabled={busy} style={{
                width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
                background: busy ? 'var(--color-border)' : primaryColor,
                color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 700,
                border: 'none', cursor: busy ? 'wait' : 'pointer', fontFamily: 'inherit',
                marginTop: 4,
              }}>
                {busy ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
