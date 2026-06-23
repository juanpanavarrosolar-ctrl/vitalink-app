'use client';
import { useState, useTransition } from 'react';
import { Icon } from '@/components/ui/icon';
import { initiateCheckout } from '@/lib/actions/checkout';

interface CheckoutButtonProps {
  planId: string;
  planToken: string;
  total: number;
  disabled?: boolean;
}

export function CheckoutButton({ planId, planToken, total, disabled }: CheckoutButtonProps) {
  const [step, setStep] = useState<'button' | 'form'>('button');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Santiago',
    region: 'Región Metropolitana',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function submit() {
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await initiateCheckout({ planId, planToken, ...form });
      } catch (e: any) {
        setError(e.message ?? 'Ocurrió un error. Intenta nuevamente.');
      }
    });
  }

  if (step === 'button') {
    return (
      <button
        disabled={disabled}
        onClick={() => setStep('form')}
        style={{
          width: '100%', padding: 'var(--sp-4)', background: 'var(--color-primary)', color: '#fff',
          borderRadius: 'var(--radius-md)', fontSize: 'var(--text-md)', fontWeight: 700,
          border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit',
        }}
      >
        <Icon name="cart" size={20} />
        Comprar protocolo completo
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 4 }}>Datos de contacto y envío</div>

      {[
        { name: 'name', label: 'Nombre completo *', placeholder: 'Tu nombre' },
        { name: 'email', label: 'Email *', placeholder: 'tu@email.com', type: 'email' },
        { name: 'phone', label: 'Teléfono', placeholder: '+56 9 XXXX XXXX', type: 'tel' },
        { name: 'address', label: 'Dirección de envío *', placeholder: 'Calle, número, depto' },
        { name: 'city', label: 'Ciudad', placeholder: 'Santiago' },
      ].map(f => (
        <div key={f.name}>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            {f.label}
          </label>
          <input
            name={f.name}
            type={f.type ?? 'text'}
            value={form[f.name as keyof typeof form]}
            onChange={handleChange}
            placeholder={f.placeholder}
            style={{
              width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', background: 'var(--color-bg)',
              color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit',
              boxSizing: 'border-box', outline: 'none',
            }}
          />
        </div>
      ))}

      {error && (
        <div style={{ padding: 'var(--sp-3)', background: 'var(--red-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--red-700)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
        <button
          onClick={() => setStep('button')}
          style={{ flex: 1, padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Volver
        </button>
        <button
          onClick={submit}
          disabled={isPending}
          style={{
            flex: 2, padding: 'var(--sp-3)', background: isPending ? 'var(--color-border)' : 'var(--color-primary)',
            color: '#fff', borderRadius: 'var(--radius-md)', border: 'none',
            fontSize: 'var(--text-sm)', fontWeight: 700, cursor: isPending ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit',
          }}
        >
          {isPending ? (
            <>
              <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              Procesando...
            </>
          ) : (
            <>
              <Icon name="lock" size={15} />
              Ir a pagar
            </>
          )}
        </button>
      </div>

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
        Pago seguro procesado por Flow · Tu información está protegida
      </p>
    </div>
  );
}
