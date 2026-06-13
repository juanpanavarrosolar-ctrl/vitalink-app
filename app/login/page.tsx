'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email o contraseña incorrectos.');
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ width: 400, background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--sp-8)', boxShadow: 'var(--shadow-lg)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--sp-8)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" size={20} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
        </div>

        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Inicia sesión</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-6)' }}>
          Accede a tu plataforma de protocolos
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <Input label="Email" type="email" placeholder="tu@email.cl" value={email} onChange={setEmail} icon="mail" />
          <Input label="Contraseña" type="password" placeholder="••••••••" value={password} onChange={setPassword} icon="shield" />
        </div>

        {error && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '10px 12px', marginTop: 'var(--sp-2)' }}>
            {error}
          </p>
        )}

        <Button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          style={{ width: '100%', marginTop: 'var(--sp-6)', justifyContent: 'center' }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--sp-5)' }}>
          ¿Necesitas acceso? Contacta al equipo de NutriLink.
        </p>
      </div>
    </div>
  );
}
