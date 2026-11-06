import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { getServerAuthToken } from '@/lib/auth/session'
import { getMe } from '@/services/api/auth'
import { ApiError } from '@/services/api/client'

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const token = await getServerAuthToken()

  if (!token) {
    redirect('/admin')
  }

  const user = await getMe(token).catch((error: unknown) => {
    redirect(error instanceof ApiError && error.status === 401 ? '/admin?expirado=1' : '/admin')
  })

  return (
    <>
      <Navbar user={user} />
      <main className='mx-auto w-full max-w-7xl flex-1 px-0 pt-8 pb-28 lg:pt-12 lg:pb-0'>{children}</main>
    </>
  )
}
