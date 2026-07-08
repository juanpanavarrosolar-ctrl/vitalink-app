'use client';
import { useState, useTransition, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';

type Role = 'professional' | 'patient';

const PROFESSIONS = ['Nutricionista', 'Médico', 'Farmacéutico', 'Kinesiólogo', 'Otro profesional de salud'];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role') as Role | null;

  const [role, setRole] = useState<Role>(roleParam === 'patient' ? 'patient' : 'professional');
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    full_name: '', profession: '', specialty: '',
    license_number: '', clinic_name: '',
  });

  useEffect(() => {
    if (roleParam === 'patient' || roleParam === 'professional') {
      setRole(roleParam);
      setStep(1); // skip role selector if already provided via URL
    } else {
      setStep(0);
    }
  }, [roleParam]);

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setError(null);
  }

  function selectRole(r: Role) {
    setRole(r);
    setError(null);
    setStep(1);
  }

  function nextStep() {
    if (step === 1) {
      if (!form.email || !form.password) { setError('Email y contraseña son obligatorios'); return; }
      if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
      if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    }
    if (step === 2 && role === 'professional') {
      if (!form.full_name.trim()) { setError('El nombre completo es obligatorio'); return; }
      if (!form.profession) { setError('Selecciona tu profesión'); return; }
    }
    if (step === 2 && role === 'patient') {
      if (!form.full_name.trim()) { setError('Tu nombre es obligatorio'); return; }
    }
    setError(null);
    setStep(s => (s + 1) as any);
  }

  function submit() {
    startTransition(async () => {
      const supabase = createClient();

      const { data: authData, error: signUpErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: role === 'patient' ? 'patient' : 'professional',
            full_name: form.full_name,
          }
        },
      });

      if (signUpErr || !authData.user) {
        setError(signUpErr?.message ?? 'Error al crear la cuenta');
        return;
      }

      if (role === 'professional') {
        const { error: proErr } = await supabase.from('professionals').insert({
          user_id: authData.user.id,
          full_name: form.full_name.trim(),
          profession: form.profession,
          specialty: form.specialty.trim() || null,
          license_number: form.license_number.trim() || null,
          clinic_name: form.clinic_name.trim() || null,
          verification_status: 'pending',
        });
        if (proErr) { setError(proErr.message); return; }
        router.replace('/onboarding');
      } else {
        router.replace('/patient/dashboard');
      }
    });
  }

  const inputStyle = {
    width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', background: 'var(--color-bg)',
    color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit',
    boxSizing: 'border-box' as const, outline: 'none',
  };

  const isProfessional = role === 'professional';
  const primaryColor = isProfessional ? 'var(--color-primary)' : 'var(--emerald-600, #059669)';
  const accentBg = isProfessional ? 'var(--color-primary-light, #e0f2fe)' : 'var(--emerald-50, #ecfdf5)';

  // Total steps per role: professional = 3, patient = 2
  const totalSteps = isProfessional ? 3 : 2;
  const currentStepDisplay = step === 0 ? 0 : step;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-6)' }}>

      {/* Back */}
      <Link href="/" style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
        <Icon name="arrow-left" size={15} style={{ color: 'var(--color-text-tertiary)' }} />
        Inicio
      </Link>

      <div style={{ maxWidth: 460, width: '100%' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={20} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>VitaLink</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Crear cuenta</h1>
          {step > 0 && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {isProfessional ? 'Cuenta profesional' : 'Cuenta paciente'} · Paso {step} de {totalSteps}
            </p>
          )}
        </div>

        {/* Progress bar (solo si ya eligió rol) */}
        {step > 0 && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 'var(--radius-full)',
                background: i + 1 <= step ? primaryColor : 'var(--color-border)',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
        )}

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--sp-6)', boxShadow: 'var(--shadow-md)' }}>

          {/* PASO 0: Selección de rol */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>¿Cómo quieres usar VitaLink?</h2>
              {([
                {
                  key: 'professional' as Role,
                  icon: 'stethoscope',
                  title: 'Soy Profesional de Salud',
                  desc: 'Nutricionista, médico, farmacéutico y más: crea protocolos y comparte planes con tus pacientes',
                },
                {
                  key: 'patient' as Role,
                  icon: 'user',
                  title: 'Soy Paciente',
                  desc: 'Accede a tu plan de suplementación personalizado',
                },
              ]).map(({ key, icon, title, desc }) => (
                <button
                  key={key}
                  onClick={() => selectRole(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 18px', borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    background: 'var(--color-bg)', cursor: 'pointer',
                    textAlign: 'left', transition: 'border-color 0.15s, box-shadow 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = key === 'professional' ? 'var(--color-primary)' : 'var(--emerald-400, #34d399)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
                    background: key === 'professional' ? 'var(--color-primary-light, #e0f2fe)' : 'var(--emerald-50, #ecfdf5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={icon as any} size={22} style={{ color: key === 'professional' ? 'var(--color-primary)' : 'var(--emerald-600, #059669)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 2 }}>{title}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{desc}</p>
                  </div>
                  <Icon name="chevron-right" size={16} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}

          {/* PASO 1: Credenciales */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={isProfessional ? 'stethoscope' : 'user'} size={18} style={{ color: primaryColor }} />
                </div>
                <h2 style={{ fontWeight: 700 }}>Datos de acceso</h2>
              </div>
              {[
                { key: 'email', label: isProfessional ? 'Email profesional' : 'Tu email', type: 'email', placeholder: 'tu@email.com' },
                { key: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 8 caracteres' },
                { key: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', placeholder: 'Repite tu contraseña' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>{f.label}</label>
                  <input value={form[f.key as keyof typeof form]} onChange={e => set(f.key, e.target.value)} type={f.type} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>
          )}

          {/* PASO 2: Datos personales */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>
                {isProfessional ? 'Datos profesionales' : 'Tus datos'}
              </h2>
              {isProfessional ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>Profesión *</label>
                    <select value={form.profession} onChange={e => set('profession', e.target.value)} style={inputStyle}>
                      <option value="" disabled>Selecciona tu profesión</option>
                      {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
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
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>Nombre completo *</label>
                    <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Tu nombre" style={inputStyle} />
                  </div>
                  <div style={{ padding: '12px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, display: 'flex', gap: 8 }}>
                    <Icon name="info" size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: 1 }} />
                    Tu profesional de salud te enviará un link personalizado con tu plan. Podrás verlo y comprarlo desde ahí.
                  </div>
                </>
              )}
            </div>
          )}

          {/* PASO 3: Confirmación (solo profesional) */}
          {step === 3 && isProfessional && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Confirma tu cuenta</h2>
              <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', fontSize: 'var(--text-sm)' }}>
                {[
                  ['Email', form.email],
                  ['Nombre', form.full_name],
                  ['Profesión', form.profession || '—'],
                  ['Especialidad', form.specialty || '—'],
                  ['Colegiatura', form.license_number || '—'],
                  ['Consulta', form.clinic_name || '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Al crear tu cuenta aceptas los Términos de Uso de VitaLink. Tu perfil será revisado por el equipo antes de ser verificado.
              </p>
            </div>
          )}

          {/* Confirmación paciente (paso 3 = paso 2+1) */}
          {step === 3 && !isProfessional && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Confirma tu cuenta</h2>
              <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', fontSize: 'var(--text-sm)' }}>
                {[['Email', form.email], ['Nombre', form.full_name]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Al crear tu cuenta aceptas los Términos de Uso de VitaLink.
              </p>
            </div>
          )}

          {error && (
            <div style={{ marginTop: 'var(--sp-3)', padding: 'var(--sp-3)', background: 'var(--red-50, #fef2f2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--red-700, #b91c1c)' }}>
              {error}
            </div>
          )}

          {/* Buttons */}
          {step > 0 && (
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-5)' }}>
              <button
                onClick={() => setStep(s => (s - 1) as any)}
                style={{ flex: 1, padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Atrás
              </button>
              <button
                onClick={step === totalSteps ? submit : nextStep}
                disabled={isPending}
                style={{ flex: 2, padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', background: isPending ? 'var(--color-border)' : primaryColor, color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 700, border: 'none', cursor: isPending ? 'wait' : 'pointer', fontFamily: 'inherit' }}
              >
                {isPending ? 'Creando cuenta...' : step === totalSteps ? 'Crear mi cuenta' : 'Continuar'}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 'var(--sp-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href={`/login?role=${role}`} style={{ color: primaryColor, fontWeight: 600, textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
