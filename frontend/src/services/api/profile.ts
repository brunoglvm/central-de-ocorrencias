import { apiFetch } from '@/services/api/client'
import type { UpdateAvatarResponse } from '@/types/auth'

export function updateAvatar(file: File, token?: string) {
  const formData = new FormData()
  formData.append('avatar', file)

  return apiFetch<UpdateAvatarResponse>('/me/avatar', {
    method: 'PATCH',
    body: formData,
    token,
  })
}
