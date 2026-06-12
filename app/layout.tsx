import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NutriLink — Plataforma para Nutricionistas',
  description: 'Gestiona protocolos, pacientes y suplementos con NutriLink',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
