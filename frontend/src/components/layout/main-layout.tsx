'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'

type MainLayoutProps = {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const navbarRoutes = ['/admin/quadro', '/admin/historico']
  const shouldShowNavbar = navbarRoutes.includes(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      {shouldShowNavbar ? <Navbar /> : null}

      <main className="mx-auto w-full max-w-7xl flex-1 px-0 pt-8 pb-28 sm:px-6 lg:px-8 lg:pt-12 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
