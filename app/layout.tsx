import type { Metadata, Viewport } from 'next';
import './globals.css';

const BASE_URL = 'https://vitalink-mvp.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'VitaLink — Productos de salud recomendados por tu profesional',
    template: '%s | VitaLink',
  },
  description:
    'VitaLink conecta a profesionales de la salud (nutricionistas, médicos, farmacéuticos y más) con sus pacientes para recomendar, comprar y hacer seguimiento de protocolos de suplementación. Activo en Chile.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: BASE_URL,
    siteName: 'VitaLink',
    title: 'VitaLink — Productos de salud recomendados por tu profesional',
    description:
      'La plataforma que conecta a profesionales de la salud con sus pacientes para recomendar y comprar protocolos de suplementación de forma simple y segura.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'VitaLink — Plataforma de suplementación para profesionales de la salud',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VitaLink — Suplementación personalizada',
    description:
      'La plataforma que conecta a profesionales de la salud con sus pacientes para gestionar protocolos de suplementación.',
    images: [`${BASE_URL}/og-image.png`],
  },
  keywords: [
    'profesionales de salud', 'nutricionista', 'médico', 'farmacéutico', 'suplementación', 'protocolos', 'salud',
    'pacientes', 'Chile', 'plataforma salud', 'suplementos', 'productos de salud',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#059669',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
