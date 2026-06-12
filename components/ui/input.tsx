'use client';
import { useState } from 'react';
import { Icon } from './icon';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  icon?: string;
  type?: string;
  style?: React.CSSProperties;
}

export function Input({ label, placeholder, value, onChange, icon, type = 'text', style: extra }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
        background: 'var(--color-surface)', border: `1px solid ${focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)',
        transition: 'all var(--duration-fast) var(--ease-in-out)',
        boxShadow: focused ? 'var(--shadow-ring)' : 'none',
        ...extra,
      }}>
        {icon && <Icon name={icon} size={18} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />}
        <input
          type={type}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', width: '100%' }}
        />
      </div>
    </div>
  );
}
