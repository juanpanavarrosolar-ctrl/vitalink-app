'use client';
import { useEffect, useRef } from 'react';
import { Icon } from './icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ open, onClose, title, children, maxWidth = 480 }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--sp-4)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xl)',
        width: '100%',
        maxWidth,
        animation: 'fadeInDown 180ms var(--ease-out) both',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--sp-5)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <h2 id="modal-title" style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-tertiary)',
              padding: 4, borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Cerrar"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: 'var(--sp-5)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
