'use client';
import { useState } from 'react';
import { Icon } from '@/components/ui/icon';

export function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently, button just won't confirm
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)', background: 'var(--color-surface)',
        color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <Icon name={copied ? 'check' : 'link'} size={16} />
      {copied ? 'Copiado' : 'Compartir'}
    </button>
  );
}
