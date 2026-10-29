import { apiFetch } from '@/services/api/client'
import type { CreateOccurrenceInput, Occurrence, OccurrenceStatus } from '@/types/occurrence'

export function getOccurrences(token?: string) {
  return apiFetch<Occurrence[]>('/occurrences', { token })
}

export function getOccurrence(id: number, token?: string) {
  return apiFetch<Occurrence>(`/occurrences/${id}`, { token })
}

export function createOccurrence(input: CreateOccurrenceInput) {
  const formData = new FormData()

  formData.append('title', input.title)
  formData.append('description', input.description)
  formData.append('location', input.location)
  formData.append('source', input.source)

  if (input.image) {
    formData.append('occurrence', input.image)
  }

  return apiFetch<Occurrence>('/public/occurrences', {
    method: 'POST',
    body: formData,
    token: null,
  })
}

export function updateOccurrenceStatus(id: number, status: OccurrenceStatus, token?: string) {
  return apiFetch<Pick<Occurrence, 'id' | 'status'>>(`/occurrences/${id}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  })
}

export function updateOccurrenceArchive(id: number, archived: boolean, token?: string) {
  return apiFetch<Pick<Occurrence, 'id' | 'archived'>>(`/occurrences/${id}/archive`, {
    method: 'PATCH',
    body: { archived },
    token,
  })
}

export function deleteOccurrence(id: number, token?: string) {
  return apiFetch<void>(`/occurrences/${id}`, {
    method: 'DELETE',
    token,
  })
}
