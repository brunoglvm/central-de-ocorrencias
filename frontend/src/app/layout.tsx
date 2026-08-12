import type { Metadata } from 'next'
import './globals.css'
import { MainLayout } from '@/components/layout/main-layout'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: {
    default: 'Central de Ocorrências',
    template: '%s | Central de Ocorrências',
  },
  description: 'Plataforma para registrar, acompanhar e consultar ocorrências no condomínio.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
