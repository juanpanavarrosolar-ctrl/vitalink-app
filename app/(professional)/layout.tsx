import { Sidebar } from '@/components/shell/sidebar';

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)' }}>
        {children}
      </main>
    </div>
  );
}
