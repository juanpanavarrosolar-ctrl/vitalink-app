'use client';
import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    full_name: '', profession: 'Nutricionista', specialty: '',
    license_number: '', clinic_name: '',
  });

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setError(null);
  }

  function nextStep() {
    if (step === 1) {
      if (!form.email || !form.password) { setError('Email y contraseña son obligatorios'); return; }
      if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
      if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    }
    if (step === 2) {
      if (!form.full_name.trim()) { setError('El nombre completo es obligatorio'); return; }
    }
    setError(null);
    setStep(s => (s < 3 ? s + 1 : s) as Step);
  }

  function submit() {
    startTransition(async () => {
      const supabase = createClient();

      const { data: authData, error: signUpErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: 'professional', full_name: form.full_name } },
      });

      if (signUpErr || !authData.user) {
        setError(signUpErr?.message ?? 'Error al crear la cuenta');
        return;
      }

      const { error: proErr } = await supabase.from('professionals').insert({
        user_id: authData.user.id,
        full_name: form.full_name.trim(),
        profession: form.profession,
        specialty: form.specialty.trim() || null,
        license_number: form.license_number.trim() || null,
        clinic_name: form.clinic_name.trim() || null,
        verification_status: 'pending',
      });

      if (proErr) {
        setError(proErr.message);
        return;
      }

      router.replace('/onboarding');
    });
  }

  const inputStyle = {
    width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', background: 'var(--color-bg)',
    color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit',
    boxSizing: 'border-box' as const, outline: 'none',
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-6)' }}>
      <div style={{ maxWidth: 440, width: '100%' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-4)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={20} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>NutriLink</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Crear cuenta</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Paso {step} de 3
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--sp-6)' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 'var(--radius-full)', background: s <= step ? 'var(--color-primary)' : 'var(--color-border)', transition: 'background 0.2s' }} />
          ))}
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--sp-6)', boxShadow: 'var(--shadow-md)' }}>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Cuenta</h2>
              {[
                { key: 'email', label: 'Email profesional', type: 'email', placeholder: 'tu@email.com' },
                { key: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mín. 8 caracteres' },
                { key: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', placeholder: 'Repite la contraseña' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>{f.label}</label>
                  <input value={form[f.key as keyof typeof form]} onChange={e => set(f.key, e.target.value)} type={f.type} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Datos profesionales</h2>
              {[
                { key: 'full_name', label: 'Nombre completo *', placeholder: 'Ej: Dra. Carmen Silva' },
                { key: 'specialty', label: 'Especialidad', placeholder: 'Ej: Nutrición deportiva' },
                { key: 'license_number', label: 'Nº colegiatura', placeholder: 'Número de registro' },
                { key: 'clinic_name', label: 'Clínica / Consulta', placeholder: 'Nombre de tu consulta (opcional)' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>{f.label}</label>
                  <input value={form[f.key as keyof typeof form]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Confirmación</h2>
              <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', fontSize: 'var(--text-sm)' }}>
                {[
                  ['Email', form.email],
                  ['Nombre', form.full_name],
                  ['Especialidad', form.specialty || '—'],
                  ['Colegiatura', form.license_number || '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Al crear tu cuenta aceptas los Términos de Uso de NutriLink. Tu perfil será revisado por el equipo antes de ser verificado.
              </p>
            </div>
          )}

          {error && (
            <div style={{ marginTop: 'var(--sp-3)', padding: 'var(--sp-3)', background: 'var(--red-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--red-700)' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-5)' }}>
            {step > 1 && (
              <button
                onClick={() => setStep(s => (s - 1) as Step)}
                style={{ flex: 1, padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Atrás
              </button>
            )}
            <button
              onClick={step === 3 ? submit : nextStep}
              disabled={isPending}
              style={{ flex: step > 1 ? 2 : 1, padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', background: isPending ? 'var(--color-border)' : 'var(--color-primary)', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 700, border: 'none', cursor: isPending ? 'wait' : 'pointer', fontFamily: 'inherit' }}
            >
              {isPending ? 'Creando cuenta...' : step === 3 ? 'Crear mi cuenta' : 'Continuar'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 'var(--sp-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          ¿Ya tienes cuenta? <a href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
}
