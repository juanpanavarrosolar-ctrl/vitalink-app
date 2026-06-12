import type { BadgeColor } from '@/lib/types';

const colors: Record<BadgeColor, React.CSSProperties> = {
  blue:    { background: 'var(--blue-50)',    color: 'var(--blue-600)' },
  emerald: { background: 'var(--emerald-50)', color: 'var(--emerald-700)' },
  amber:   { background: 'var(--amber-50)',   color: 'var(--amber-600)' },
  red:     { background: 'var(--red-50)',     color: 'var(--red-600)' },
  violet:  { background: 'var(--violet-50)',  color: 'var(--violet-600)' },
  slate:   { background: 'var(--slate-100)',  color: 'var(--slate-600)' },
};

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  dot?: boolean;
  style?: React.CSSProperties;
}

export function Badge({ children, color = 'blue', dot, style: extra }: BadgeProps) {
  const c = colors[color];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-xs)', fontWeight: 600, lineHeight: 1.4,
      ...c, ...extra,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}
