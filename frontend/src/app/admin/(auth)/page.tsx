import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { getServerAuthToken } from '@/lib/auth/session'
import { getMe } from '@/services/api/auth'
import { getCondominium } from '@/services/api/condominium'

export const metadata: Metadata = {
  title: 'Login',
}

export default async function AdminLoginPage() {
  const token = await getServerAuthToken()

  if (token) {
    const isAuthenticated = await getMe(token)
      .then(() => true)
      .catch(() => false)

    if (isAuthenticated) {
      redirect('/admin/quadro')
    }
  }

  const condominiumImage = await getCondominium()
    .then((condominium) => condominium.image)
    .catch(() => null)

  return (
    <div className='mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-3xl items-center justify-center'>
      <AdminLoginForm condominiumImage={condominiumImage} />
    </div>
  )
}
