import { occurrenceColumns } from '@/constants/occurrences'
import type { Occurrence, OccurrenceSource, OccurrenceStatus } from '@/types/occurrence'

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

export function formatOccurrenceDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  })
    .format(date)
    .replace(/\./g, '')
    .replace(/\s+de\s+/g, ' ')
}

export function getOccurrenceSourceLabel(source: OccurrenceSource) {
  return source === 'EMPLOYEE' ? 'Funcionário' : 'Morador'
}
