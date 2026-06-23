'use client';
import { useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPatient } from '@/lib/actions/patients';

interface CreatePatientFormProps {
  onSuccess: () => void;
}

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createPatient(formData);
      if (result?.error) {
        alert(result.error);
      } else {
        formRef.current?.reset();
        onSuccess();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)', color: 'var(--color-text)' }}>
            Nombre completo *
          </label>
          <Input name="name" placeholder="Ej: Camila Soto" required autoFocus />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)', color: 'var(--color-text)' }}>
            Email
          </label>
          <Input name="email" type="email" placeholder="paciente@email.com" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)', color: 'var(--color-text)' }}>
            Teléfono
          </label>
          <Input name="phone" type="tel" placeholder="+56 9 1234 5678" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)', color: 'var(--color-text)' }}>
            Año de nacimiento
          </label>
          <Input name="birth_year" type="number" placeholder="1990" min="1920" max={new Date().getFullYear()} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end', marginTop: 'var(--sp-2)' }}>
          <Button type="submit" loading={isPending}>
            Agregar paciente
          </Button>
        </div>
      </div>
    </form>
  );
}
