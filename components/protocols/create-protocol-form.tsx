'use client';
import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { createProtocol } from '@/lib/actions/protocols';

type Patient = { id: string; name: string; email: string | null };

interface CreateProtocolFormProps {
  patients: Patient[];
  onSuccess: () => void;
}

export function CreateProtocolForm({ patients, onSuccess }: CreateProtocolFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmit(formData: FormData) {
    if (!selectedPatient) return;
    formData.set('patient_id', selectedPatient.id);
    startTransition(async () => {
      const result = await createProtocol(formData);
      if (result?.error) {
        alert(result.error);
      } else if (result?.planId) {
        onSuccess();
        router.push(`/protocols/${result.planId}`);
      }
    });
  }

  if (step === 1) {
    return (
      <div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-4)' }}>
          Selecciona el paciente para este protocolo.
        </p>
        <Input
          value={search}
          onChange={val => setSearch(val)}
          placeholder="Buscar paciente..."
          icon="search"
          style={{ marginBottom: 'var(--sp-3)' }}
        />
        <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {patients.length === 0 && (
            <div style={{ padding: 'var(--sp-4)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              No tienes pacientes. Agrega uno primero.
            </div>
          )}
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedPatient(p); setStep(2); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 'var(--sp-3) var(--sp-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background var(--duration-fast) var(--ease-in-out)',
              }}
            >
              <Avatar name={p.name} size={32} />
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{p.name}</div>
                {p.email && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{p.email}</div>}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 'var(--sp-3) var(--sp-4)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--sp-4)' }}>
        <Avatar name={selectedPatient!.name} size={28} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>{selectedPatient!.name}</div>
        </div>
        <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>Cambiar</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>
            Nombre del protocolo *
          </label>
          <Input name="title" placeholder="Ej: Protocolo SOP + Resistencia Insulínica" required autoFocus />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>
            Duración (días)
          </label>
          <Input name="duration_days" type="number" defaultValue="90" min="1" max="365" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>
            Notas para el paciente
          </label>
          <textarea
            name="notes"
            placeholder="Instrucciones generales, contexto del protocolo..."
            rows={3}
            style={{
              width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', background: 'var(--color-bg)',
              color: 'var(--color-text)', fontSize: 'var(--text-sm)',
              fontFamily: 'inherit', resize: 'vertical', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={() => setStep(1)}>Atrás</Button>
          <Button type="submit" loading={isPending} icon="plus">Crear protocolo</Button>
        </div>
      </div>
    </form>
  );
}
