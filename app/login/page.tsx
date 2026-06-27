'use client';
import { useState, useEffect, Suspense, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/* ─── RUT helpers ────────────────────────────────────────────
   Valida y formatea RUT chileno (ej: 12.345.678-9)
   Acepta dígito verificador 0-9 y K
──────────────────────────────────────────────────────────── */
function cleanRut(raw: string) {
  return raw.replace(/[^0-9kK]/g, '').toUpperCase();
}
function formatRut(raw: string): string {
  const clean = cleanRut(raw);
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv   = clean.slice(-1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}
function validateRut(raw: string): boolean {
  const clean = cleanRut(raw);
  if (clean.length < 7) return false;
  const body = clean.slice(0, -1);
  const dvInput = clean.slice(-1).toUpperCase();
  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const mod = 11 - (sum % 11);
  const dvCalc = mod === 11 ? '0' : mod === 10 ? 'K' : String(mod);
  return dvInput === dvCalc;
}

/* ─── Design tokens ─────────────────────────────────────── */
const GREEN = '#10B981';
const GREEN_DARK = '#059669';
const GREEN_BG = '#ecfdf5';
const GREEN_BORDER = '#a7f3d0';
const GRAY_50 = '#F9FAFB';
const GRAY_100 = '#F3F4F6';
const GRAY_200 = '#E5E7EB';
const GRAY_400 = '#9CA3AF';
const GRAY_600 = '#4B5563';
const GRAY_900 = '#111827';

/* ─── Types ──────────────────────────────────────────────── */
type Role = 'professional' | 'patient';
type Mode = 'login' | 'register' | 'forgot';
type Step = 'role' | 'form';

/* ─── Logo ───────────────────────────────────────────────── */
function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 12px ${GREEN}40`,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: GRAY_900 }}>NutriLink</span>
    </div>
  );
}

/* ─── Input ──────────────────────────────────────────────── */
function Field({ label, type = 'text', placeholder, value, onChange, onKeyDown }: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: GRAY_600, marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
        style={{
          width: '100%', padding: '11px 14px',
          borderRadius: 10, boxSizing: 'border-box',
          border: `1.5px solid ${focused ? GREEN : GRAY_200}`,
          background: '#fff', color: GRAY_900,
          fontSize: 14, fontFamily: 'inherit', outline: 'none',
          transition: 'border-color 0.15s',
          boxShadow: focused ? `0 0 0 3px ${GREEN}20` : 'none',
        }}
      />
    </div>
  );
}

/* ─── Main form component ────────────────────────────────── */
function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role') as Role | null;
  const modeParam = searchParams.get('mode') as Mode | null;

  const [step, setStep] = useState<Step>(roleParam ? 'form' : 'role');
  const [role, setRole] = useState<Role>(roleParam === 'patient' ? 'patient' : 'professional');
  const [mode, setMode] = useState<Mode>(modeParam === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [animating, setAnimating] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password field
  const [forgotEmail, setForgotEmail] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseError, setLicenseError] = useState('');

  useEffect(() => {
    if (roleParam === 'patient' || roleParam === 'professional') { setRole(roleParam); setStep('form'); }
    if (modeParam === 'login' || modeParam === 'register') setMode(modeParam);
  }, [roleParam, modeParam]);

  function chooseRole(r: Role) {
    setRole(r);
    setError('');
    setAnimating(true);
    setTimeout(() => { setStep('form'); setAnimating(false); }, 180);
  }

  function goBack() {
    setError('');
    setAnimating(true);
    setTimeout(() => { setStep('role'); setAnimating(false); }, 180);
  }

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

  async function handleForgotPassword() {
    if (!forgotEmail) { setError('Ingresa tu email registrado'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });
    setLoading(false);
    if (error) { setError('No pudimos enviar el email. Verifica que esté registrado.'); return; }
    setForgotSent(true);
  }

  function handleRegister() {
    if (!name.trim() || !regEmail || !regPassword) { setError('Completa todos los campos obligatorios'); return; }
    if (regPassword.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    // Validar RUT si fue ingresado
    if (licenseNumber.trim()) {
      if (!validateRut(licenseNumber)) {
        setLicenseError('RUT inválido. Verifica el formato (ej: 12.345.678-9)');
        return;
      }
    } else {
      setLicenseError('El RUT o N° de matrícula es obligatorio para verificar tu cuenta');
      return;
    }
    startTransition(async () => {
      const supabase = createClient();
      const { data: authData, error: signUpErr } = await supabase.auth.signUp({
        email: regEmail, password: regPassword,
        options: { data: { role: 'professional', full_name: name } },
      });
      if (signUpErr || !authData.user) { setError(signUpErr?.message ?? 'Error al crear la cuenta'); return; }
      await supabase.from('professionals').insert({
        user_id: authData.user.id,
        full_name: name.trim(),
        profession: 'Nutricionista',
        specialty: specialty.trim() || null,
        license_number: formatRut(licenseNumber),
        verification_status: 'pending',
      });
      router.replace('/onboarding');
    });
  }

  const busy = loading || isPending;
  const isPro = role === 'professional';
  const isDev = process.env.NODE_ENV === 'development';

  /* ── STEP 1: Role selector ───────────────────────────── */
  if (step === 'role') {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: GRAY_50, padding: '24px',
        opacity: animating ? 0 : 1, transition: 'opacity 0.18s ease-out',
      }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          <Logo />

          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: GRAY_900, letterSpacing: '-0.03em', lineHeight: 1.25, marginBottom: 10 }}>
              Tu protocolo de suplementación,<br />digitalizado
            </h1>
            <p style={{ fontSize: 15, color: GRAY_600, lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
              La plataforma que conecta profesionales de la salud con sus pacientes
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* ── Card Nutricionista (PROMINENTE) ─────────── */}
            <RoleCard
              onClick={() => chooseRole('professional')}
              highlighted
              icon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              }
              iconBg={GREEN_BG}
              badge="Principal"
              badgeColor={GREEN}
              title="Soy Nutricionista"
              description="Crea protocolos, genera links únicos y gana comisiones por cada compra de tus pacientes"
              cta="Acceder como profesional →"
              ctaColor="#fff"
              ctaBg={GREEN}
            />

            {/* ── Card Paciente (SECUNDARIA) ───────────────── */}
            <RoleCard
              onClick={() => chooseRole('patient')}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GRAY_600} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              }
              iconBg={GRAY_100}
              title="Soy Paciente"
              description="Compra el plan de suplementación que tu profesional diseñó para ti"
              cta="Ver mi protocolo"
              ctaColor={GRAY_600}
              ctaBg="transparent"
              note="Necesitas el link que te envió tu nutricionista"
            />
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: GRAY_400, marginTop: 28 }}>
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => chooseRole('professional')} style={{ background: 'none', border: 'none', color: GREEN, fontWeight: 600, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    );
  }

  /* ── STEP 2: Formulario ──────────────────────────────── */
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: GRAY_50, padding: '24px',
      opacity: animating ? 0 : 1, transition: 'opacity 0.18s ease-out',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <Logo />

        {/* Back button */}
        <button onClick={goBack} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 500, color: GRAY_400, fontFamily: 'inherit',
          marginBottom: 20, padding: 0,
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = GRAY_600)}
          onMouseLeave={e => (e.currentTarget.style.color = GRAY_400)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Cambiar rol
        </button>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: `1.5px solid ${isPro ? GREEN_BORDER : GRAY_200}`,
          padding: '28px 28px 24px',
          boxShadow: isPro ? `0 8px 32px ${GREEN}18` : '0 4px 20px rgba(0,0,0,0.06)',
        }}>

          {/* Rol badge + Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: isPro ? GREEN_BG : GRAY_100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {isPro ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GRAY_600} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              )}
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: GRAY_900, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {isPro ? 'Acceso profesional' : 'Accede a tu protocolo'}
              </h2>
              <p style={{ fontSize: 12, color: GRAY_400, marginTop: 3 }}>
                {isPro ? 'Nutricionistas y profesionales de la salud' : 'Pacientes de NutriLink'}
              </p>
            </div>
          </div>

          {/* Mode tabs (solo para profesional) */}
          {isPro && (
            <div style={{
              display: 'flex', background: GRAY_100, borderRadius: 10,
              padding: 3, marginBottom: 22, gap: 2,
            }}>
              {(['login', 'register'] as Mode[]).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); setForgotSent(false); }} style={{
                  flex: 1, padding: '8px 12px', borderRadius: 8,
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? GRAY_900 : GRAY_400,
                  border: mode === m ? `1px solid ${GRAY_200}` : '1px solid transparent',
                  fontSize: 13, fontWeight: mode === m ? 700 : 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  {m === 'login' ? 'Iniciar sesión' : 'Registrarme gratis'}
                </button>
              ))}
            </div>
          )}

          {/* ── Forgot password flow ── */}
          {mode === 'forgot' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {forgotSent ? (
                <div style={{
                  padding: '16px', borderRadius: 10,
                  background: '#ECFDF5', border: '1px solid #A7F3D0',
                  fontSize: 13, color: '#065F46', lineHeight: 1.6, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📬</div>
                  <strong>Revisa tu email</strong><br />
                  Te enviamos un link para restablecer tu contraseña a <strong>{forgotEmail}</strong>.
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: GRAY_600, lineHeight: 1.55 }}>
                    Ingresa tu email registrado y te enviaremos un link para crear una nueva contraseña.
                  </p>
                  <Field
                    label="Email registrado" type="email"
                    placeholder="tu@email.cl"
                    value={forgotEmail} onChange={v => { setForgotEmail(v); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                  />
                  {error && <ErrorBox msg={error} />}
                  <SubmitBtn busy={busy} isPro={isPro} label="Enviar link de recuperación" onClick={handleForgotPassword} />
                </>
              )}
              <button
                onClick={() => { setMode('login'); setError(''); setForgotSent(false); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: GRAY_400, fontFamily: 'inherit',
                  textAlign: 'center', textDecoration: 'underline', padding: 0,
                }}
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          )}

          {/* ── Login form ── */}
          {(mode === 'login' || !isPro) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field
                label="Email" type="email"
                placeholder={isPro ? 'nutricionista@email.cl' : 'tu@email.cl'}
                value={email} onChange={v => { setEmail(v); setError(''); }}
              />
              <div>
                <Field
                  label="Contraseña" type="password"
                  placeholder="••••••••"
                  value={password} onChange={v => { setPassword(v); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                {isPro && (
                  <div style={{ textAlign: 'right', marginTop: 6 }}>
                    <button
                      onClick={() => { setMode('forgot'); setForgotEmail(email); setError(''); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 12, color: GREEN, fontWeight: 600,
                        fontFamily: 'inherit', padding: 0,
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}
              </div>

              {!isPro && (
                <div style={{
                  padding: '10px 12px', borderRadius: 9,
                  background: '#FFF7ED', border: '1px solid #FED7AA',
                  fontSize: 12, color: '#92400E', lineHeight: 1.5,
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                  Tu cuenta fue creada por tu nutricionista. Si no tienes contraseña, pídele el link de tu protocolo — puedes comprarlo sin iniciar sesión.
                </div>
              )}

              {error && <ErrorBox msg={error} />}

              <SubmitBtn busy={busy} isPro={isPro} label="Iniciar sesión" onClick={handleLogin} />

              {/* Demo credentials — only in development */}
              {isDev && isPro && (
                <div style={{
                  padding: '10px 12px', background: GRAY_50, borderRadius: 9,
                  border: `1px dashed ${GRAY_200}`,
                  fontSize: 12, color: GRAY_400, lineHeight: 1.6,
                }}>
                  <span style={{ color: GRAY_600, fontWeight: 600 }}>DEV:</span>{' '}
                  demo@nutrilink.cl · Nutrilink2024!
                </div>
              )}
            </div>
          )}

          {/* ── Register form (professional only) ── */}
          {mode === 'register' && isPro && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field
                label="Nombre completo *"
                placeholder="Ej: Dra. Carmen Silva"
                value={name}
                onChange={v => { setName(v); setError(''); }}
              />

              {/* RUT — obligatorio con validación en tiempo real */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: GRAY_600, marginBottom: 6 }}>
                  RUT / N° de matrícula *
                </label>
                <input
                  type="text"
                  placeholder="Ej: 12.345.678-9"
                  value={licenseNumber}
                  onChange={e => {
                    const formatted = formatRut(e.target.value);
                    setLicenseNumber(formatted);
                    setLicenseError('');
                    setError('');
                  }}
                  onBlur={() => {
                    if (licenseNumber && !validateRut(licenseNumber)) {
                      setLicenseError('RUT inválido. Verifica el formato (ej: 12.345.678-9)');
                    }
                  }}
                  autoComplete="off"
                  maxLength={12}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10, boxSizing: 'border-box',
                    border: `1.5px solid ${licenseError ? '#fca5a5' : GRAY_200}`,
                    background: licenseError ? '#fef2f2' : '#fff',
                    color: GRAY_900, fontSize: 14, fontFamily: 'inherit', outline: 'none',
                  }}
                />
                {licenseError && (
                  <p style={{ fontSize: 11, color: '#b91c1c', marginTop: 5, lineHeight: 1.4 }}>
                    {licenseError}
                  </p>
                )}
                <p style={{ fontSize: 11, color: GRAY_400, marginTop: 5, lineHeight: 1.4 }}>
                  Requerido para verificar tu credencial profesional
                </p>
              </div>

              <Field label="Especialidad" placeholder="Ej: Nutrición deportiva" value={specialty} onChange={setSpecialty} />
              <div style={{ height: 1, background: GRAY_100, margin: '2px 0' }} />
              <Field label="Email profesional *" type="email" placeholder="tu@email.com" value={regEmail} onChange={v => { setRegEmail(v); setError(''); }} />
              <Field label="Contraseña *" type="password" placeholder="Mínimo 8 caracteres" value={regPassword} onChange={v => { setRegPassword(v); setError(''); }} />

              {error && <ErrorBox msg={error} />}

              <SubmitBtn busy={busy} isPro label="Crear cuenta gratuita" onClick={handleRegister} />

              <p style={{ fontSize: 11, color: GRAY_400, textAlign: 'center', lineHeight: 1.5 }}>
                Al registrarte aceptas nuestros{' '}
                <a href="/terms" style={{ color: GREEN, fontWeight: 600 }}>Términos de Servicio</a>
                {' '}y{' '}
                <a href="/privacy" style={{ color: GREEN, fontWeight: 600 }}>Política de Privacidad</a>
                {' '}conforme a la ley 19.628 (Chile)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function RoleCard({ onClick, highlighted = false, icon, iconBg, badge, badgeColor, title, description, cta, ctaColor, ctaBg, note }: {
  onClick: () => void; highlighted?: boolean;
  icon: React.ReactNode; iconBg: string;
  badge?: string; badgeColor?: string;
  title: string; description: string;
  cta: string; ctaColor: string; ctaBg: string;
  note?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: highlighted ? (hovered ? '#f0fdf8' : '#fff') : (hovered ? GRAY_50 : '#fff'),
        border: highlighted
          ? `2px solid ${hovered ? GREEN : GREEN_BORDER}`
          : `1.5px solid ${hovered ? GRAY_200 : GRAY_200}`,
        borderRadius: 14,
        padding: highlighted ? '20px 22px' : '16px 20px',
        boxShadow: highlighted
          ? (hovered ? `0 8px 28px ${GREEN}28` : `0 4px 16px ${GREEN}14`)
          : (hovered ? '0 3px 12px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.04)'),
        transition: 'all 0.18s ease',
        fontFamily: 'inherit', display: 'flex', alignItems: 'flex-start', gap: 16,
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      {/* Icon */}
      <div style={{
        width: highlighted ? 48 : 40, height: highlighted ? 48 : 40, borderRadius: highlighted ? 12 : 10,
        background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: highlighted ? 17 : 15, fontWeight: 800, color: GRAY_900, letterSpacing: '-0.01em' }}>
            {title}
          </span>
          {badge && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: badgeColor,
              background: `${badgeColor}18`, border: `1px solid ${badgeColor}40`,
              padding: '2px 7px', borderRadius: 20, letterSpacing: '0.02em', textTransform: 'uppercase',
            }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: highlighted ? 13 : 12, color: GRAY_600, lineHeight: 1.55, marginBottom: highlighted ? 14 : 10 }}>
          {description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: 12, fontWeight: 700, color: ctaColor,
            background: ctaBg,
            padding: highlighted ? '7px 16px' : '5px 12px',
            borderRadius: 8,
            border: highlighted ? 'none' : `1px solid ${GRAY_200}`,
            boxShadow: highlighted ? `0 2px 8px ${GREEN}30` : 'none',
            gap: 4,
          }}>
            {cta}
          </span>
        </div>
        {note && (
          <p style={{ fontSize: 11, color: GRAY_400, marginTop: 8, lineHeight: 1.4 }}>
            ⓘ {note}
          </p>
        )}
      </div>
    </button>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{
      padding: '10px 12px', background: '#fef2f2',
      border: '1px solid #fecaca', borderRadius: 9,
      fontSize: 13, color: '#b91c1c', display: 'flex', gap: 8, alignItems: 'flex-start',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
      {msg}
    </div>
  );
}

function SubmitBtn({ busy, isPro, label, onClick }: { busy: boolean; isPro: boolean; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={busy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', padding: '12px 20px',
        borderRadius: 10, border: 'none',
        background: busy
          ? GRAY_200
          : (hovered ? GREEN_DARK : (isPro ? GREEN : GREEN_DARK)),
        color: busy ? GRAY_400 : '#fff',
        fontSize: 14, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', marginTop: 4,
        transition: 'all 0.15s ease',
        boxShadow: busy ? 'none' : `0 3px 12px ${GREEN}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
    >
      {busy && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      )}
      {busy ? 'Procesando...' : label}
    </button>
  );
}

/* ─── Keyframe for spinner ────────────────────────────────── */
const spinStyle = `@keyframes spin { to { transform: rotate(360deg); } }`;

export default function LoginPage() {
  return (
    <>
      <style>{spinStyle}</style>
      <Suspense>
        <AuthForm />
      </Suspense>
    </>
  );
}
