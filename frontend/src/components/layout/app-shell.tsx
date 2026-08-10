'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const navbarRoutes = ['/admin/quadro', '/admin/historico']
  const shouldHideNavbar = !navbarRoutes.includes(pathname)

  return (
    <div className="min-h-screen bg-(--color-surface) text-(--color-on-surface)">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-105 bg-[radial-gradient(circle_at_top_left,rgba(109,145,151,0.18),transparent_58%)]" />
        <div className="absolute top-24 -right-32 rounded-full bg-[rgba(87,122,128,0.12)] blur-3xl size-72" />
      </div>

      {shouldHideNavbar ? null : <Navbar />}

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-8 pb-28 sm:px-6 lg:px-8 lg:pt-12 lg:pb-14">
        {children}
      </main>
    </div>
  )
}
