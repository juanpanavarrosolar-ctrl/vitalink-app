interface AvatarProps {
  name: string;
  size?: number;
  src?: string;
  style?: React.CSSProperties;
}

export function Avatar({ name, size = 36, src, style: extra }: AvatarProps) {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const s: React.CSSProperties = {
    width: size, height: size, borderRadius: 'var(--radius-full)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.38, fontWeight: 700, color: '#fff',
    background: src ? 'none' : `oklch(0.55 0.12 ${hue})`,
    flexShrink: 0, ...extra,
  };
  if (src) return <img src={src} alt={name} style={{ ...s, objectFit: 'cover' }} />;
  return <div style={s}>{initials}</div>;
}
