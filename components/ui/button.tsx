'use client';
import { useState, useReducer } from 'react';
import { Icon } from './icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconRight?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary:   { background: 'var(--color-primary)',  color: '#fff' },
  secondary: { background: 'var(--color-surface)',  color: 'var(--color-text)', border: '1px solid var(--color-border)' },
  ghost:     { background: 'transparent',           color: 'var(--color-text-secondary)' },
  danger:    { background: 'var(--color-error)',    color: '#fff' },
  success:   { background: 'var(--color-success)',  color: '#fff' },
};

const hoverStyles: Record<Variant, Partial<React.CSSProperties>> = {
  primary:   { background: 'var(--color-primary-hover)' },
  secondary: { background: 'var(--slate-50)' },
  ghost:     { background: 'var(--slate-100)' },
  danger:    { background: 'var(--red-700)' },
  success:   { background: 'var(--emerald-700)' },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  xs: { padding: '6px 10px',  fontSize: 'var(--text-xs)' },
  sm: { padding: '8px 14px',  fontSize: 'var(--text-sm)' },
  md: { padding: '10px 18px', fontSize: 'var(--text-base)' },
  lg: { padding: '12px 24px', fontSize: 'var(--text-md)' },
};

const iconSize: Record<Size, number> = { xs: 14, sm: 15, md: 16, lg: 16 };

export function Button({
  children, variant = 'primary', size = 'md', icon, iconRight,
  disabled, loading, onClick, style: extra = {}, className = '', type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;

  const s: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-sans)', fontWeight: 600, borderRadius: 'var(--radius-md)',
    transition: `all var(--duration-fast) var(--ease-in-out)`,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: 'none', whiteSpace: 'nowrap', lineHeight: 1,
    opacity: isDisabled ? 0.55 : 1,
    transform: pressed && !isDisabled ? 'scale(0.97)' : hover && !isDisabled ? 'translateY(-1px)' : 'none',
    boxShadow: hover && !isDisabled && variant === 'primary' ? 'var(--shadow-md)' : 'none',
    ...variantStyles[variant],
    ...(hover && !isDisabled ? hoverStyles[variant] : {}),
    ...sizeStyles[size],
    ...extra,
  };

  return (
    <button
      type={type}
      style={s}
      className={className}
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading ? (
        <span style={{
          width: iconSize[size], height: iconSize[size],
          border: '2px solid currentColor', borderTopColor: 'transparent',
          borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0,
        }} aria-hidden="true" />
      ) : icon ? (
        <Icon name={icon} size={iconSize[size]} aria-hidden="true" />
      ) : null}
      {children}
      {!loading && iconRight && <Icon name={iconRight} size={iconSize[size]} aria-hidden="true" />}
    </button>
  );
}
