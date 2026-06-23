'use client';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nl_disclaimer_accepted';

export function DisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) setShow(true);
  }, []);

  function accept() {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: 'var(--sp-4)',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
          maxWidth: 560, width: '100%', padding: 'var(--sp-6)',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeInDown 260ms var(--ease-out) both',
        }}
      >
        <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--sp-4)' }}>
          <div style={{ fontSize: 24 }}>⚠️</div>
          <div>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 6 }}>
              Información importante antes de continuar
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Este protocolo de suplementación ha sido elaborado por un profesional de la salud.
              Los suplementos alimentarios <strong>no son medicamentos</strong> y no reemplazan un diagnóstico médico,
              tratamiento médico ni prescripción farmacéutica.
            </p>
          </div>
        </div>

        <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.65, borderLeft: '3px solid var(--color-border)' }}>
          <strong style={{ display: 'block', marginBottom: 6, color: 'var(--color-text)' }}>Aviso regulatorio (DS 977)</strong>
          Los suplementos comercializados a través de esta plataforma cuentan con autorización sanitaria del ISP Chile.
          Los beneficios descritos corresponden a información nutricional general y no constituyen una afirmación de propiedades
          terapéuticas o medicinales. El uso de suplementos debe complementar una alimentación equilibrada y un estilo de vida saludable.
          NutriLink no reemplaza la consulta con un profesional de salud calificado.
        </div>

        <button
          onClick={accept}
          style={{
            width: '100%', padding: 'var(--sp-3) var(--sp-4)',
            background: 'var(--color-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Entendido, ver mi protocolo
        </button>
      </div>
    </div>
  );
}
