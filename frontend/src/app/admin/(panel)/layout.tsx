import type { ReactNode } from 'react'
import { Navbar } from '@/components/layout/navbar'

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className='mx-auto w-full max-w-7xl flex-1 px-0 pt-8 pb-28 lg:pt-12 lg:pb-0'>{children}</main>
    </>
  )
}
