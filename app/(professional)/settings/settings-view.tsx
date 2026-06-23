'use client';
import { useState, useTransition } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

type Professional = {
  id: string;
  full_name: string;
  profession: string | null;
  specialty: string | null;
  clinic_name: string | null;
  license_number: string | null;
  verification_status: string;
  discount_mode: string;
  discount_value: number | null;
};

interface SettingsViewProps {
  email: string;
  professional: Professional | null;
}

const VERIFICATION_COLOR: Record<string, 'emerald' | 'amber' | 'red' | 'slate'> = {
  verified: 'emerald', pending: 'amber', rejected: 'red', suspended: 'red',
};
const VERIFICATION_LABEL: Record<string, string> = {
  verified: 'Verificado', pending: 'Pendiente verificación', rejected: 'Rechazado', suspended: 'Suspendido',
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', background: 'var(--color-bg)', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        {value || '—'}
      </div>
    </div>
  );
}

export function SettingsView({ email, professional }: SettingsViewProps) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    full_name: professional?.full_name ?? '',
    specialty: professional?.specialty ?? '',
    clinic_name: professional?.clinic_name ?? '',
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!professional) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from('professionals')
        .update({
          full_name: form.full_name.trim(),
          specialty: form.specialty.trim() || null,
          clinic_name: form.clinic_name.trim() || null,
        })
        .eq('id', professional.id);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  if (!professional) {
    return (
      <div style={{ padding: 'var(--sp-8)', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <p>Perfil no encontrado. Completa el <a href="/onboarding">onboarding</a>.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--sp-8)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Ajustes</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>Configura tu perfil profesional</p>
      </div>

      {/* Profile card */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-6)', marginBottom: 'var(--sp-4)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 60ms both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)' }}>
            <Avatar name={professional.full_name} size={64} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{professional.full_name}</h2>
                <Badge color={VERIFICATION_COLOR[professional.verification_status] ?? 'slate'}>
                  {VERIFICATION_LABEL[professional.verification_status] ?? professional.verification_status}
                </Badge>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {professional.specialty ?? professional.profession ?? 'Profesional de salud'}
              </div>
            </div>
          </div>
          {!editing && (
            <Button variant="secondary" size="sm" icon="settings" onClick={() => setEditing(true)}>
              Editar perfil
            </Button>
          )}
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {[
              { key: 'full_name', label: 'Nombre completo' },
              { key: 'specialty', label: 'Especialidad' },
              { key: 'clinic_name', label: 'Clínica / Consulta' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>
                  {label}
                </label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                    color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit',
                    boxSizing: 'border-box', outline: 'none',
                  }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
              <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button size="sm" loading={isPending} onClick={handleSave}>Guardar cambios</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <Field label="Email" value={email} />
            <Field label="Profesión" value={professional.profession ?? '—'} />
            <Field label="Especialidad" value={professional.specialty ?? '—'} />
            <Field label="Número de registro" value={professional.license_number ?? '—'} />
            <Field label="Clínica / Consulta" value={professional.clinic_name ?? '—'} />
          </div>
        )}

        {saved && (
          <div style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-4)', background: 'var(--emerald-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--emerald-700)', fontWeight: 500 }}>
            ✓ Perfil actualizado correctamente
          </div>
        )}
      </div>

      {/* Commission info */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 120ms both' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--sp-3)' }}>Comisiones</h3>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Modo actual: <strong style={{ color: 'var(--color-text)' }}>{professional.discount_mode}</strong>
          {professional.discount_value && (
            <> · Valor: <strong style={{ color: 'var(--color-text)' }}>{professional.discount_value}{professional.discount_mode === 'percentage' ? '%' : ' CLP'}</strong></>
          )}
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 8, lineHeight: 1.5 }}>
          Las comisiones son transparentes hacia los pacientes, en cumplimiento con los principios éticos de NutriLink y la normativa DS 977.
        </p>
      </div>
    </div>
  );
}
