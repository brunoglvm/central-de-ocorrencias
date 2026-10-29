import { apiFetch } from '@/services/api/client'
import type { Condominium } from '@/types/auth'

export function getCondominium() {
  return apiFetch<Condominium>('/public/condominium')
}
