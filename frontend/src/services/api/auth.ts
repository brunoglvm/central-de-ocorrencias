import { apiFetch } from '@/services/api/client'
import type { AdminUser, LoginCredentials, LoginResponse } from '@/types/auth'

export function login(credentials: LoginCredentials) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
    token: null,
  })
}

export function getMe(token?: string) {
  return apiFetch<AdminUser>('/me', { token })
}
