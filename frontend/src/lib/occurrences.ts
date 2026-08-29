import { occurrenceColumns } from '@/constants/occurrences'
import type { Occurrence, OccurrenceStatus } from '@/types/occurrence'

export function groupOccurrencesByStatus(occurrences: Occurrence[]) {
  return occurrenceColumns.reduce(
    (groups, status) => {
      groups[status] = occurrences.filter((occurrence) => occurrence.status === status)
      return groups
    },
    {} as Record<OccurrenceStatus, Occurrence[]>,
  )
}

export function getImageFileName(imageUrl?: string | null) {
  if (!imageUrl) {
    return 'Imagem anexada'
  }

  const segments = imageUrl.split('/')
  return segments[segments.length - 1] || 'Imagem anexada'
}