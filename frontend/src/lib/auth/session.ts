import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_TOKEN_COOKIE } from '@/services/api/client'

export async function getServerAuthToken() {
  const cookieStore = await cookies()

  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null
}

export async function requireServerAuthToken() {
  const token = await getServerAuthToken()

  if (!token) {
    redirect('/admin')
  }

  return token
}
