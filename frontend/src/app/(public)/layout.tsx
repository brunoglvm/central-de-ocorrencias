import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='mx-auto w-full max-w-7xl flex-1 px-4 pt-8 pb-28 sm:px-6 lg:px-8 lg:pt-12 lg:pb-0'>
        {children}
      </main>
    </div>
  )
}
