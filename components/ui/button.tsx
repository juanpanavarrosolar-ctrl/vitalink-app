'use client';
import { useState } from 'react';
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
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
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
  disabled, onClick, style: extra = {}, className = '', type = 'button',
}: ButtonProps) {
  const [hover, setHover] = useState(false);

  const s: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-sans)', fontWeight: 600, borderRadius: 'var(--radius-md)',
    transition: 'all var(--duration-fast) var(--ease-in-out)', cursor: disabled ? 'default' : 'pointer',
    border: 'none', whiteSpace: 'nowrap', lineHeight: 1,
    opacity: disabled ? 0.5 : 1,
    transform: hover && !disabled ? 'translateY(-1px)' : 'none',
    ...variantStyles[variant],
    ...(hover && !disabled ? hoverStyles[variant] : {}),
    ...sizeStyles[size],
    ...extra,
  };

  return (
    <button
      type={type}
      style={s}
      className={className}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={iconSize[size]} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize[size]} />}
    </button>
  );
}
