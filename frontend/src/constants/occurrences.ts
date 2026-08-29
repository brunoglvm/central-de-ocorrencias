import type { OccurrenceStatus } from '@/types/occurrence'

export const occurrenceColumns: OccurrenceStatus[] = ['open', 'in_progress', 'resolved']

export const occurrenceLocations = [
  'Entrada principal',
  'Portaria',
  'Garagem',
  'Bloco A',
  'Bloco B',
  'Área gourmet',
  'Corredor',
  'Elevador',
]

export const historyPageSize = 4

export const statusMeta: Record<OccurrenceStatus, { label: string; description: string }> = {
  open: {
    label: 'Abertas',
    description: 'Ocorrências recém-registradas aguardando triagem inicial.',
  },
  in_progress: {
    label: 'Em andamento',
    description: 'Casos em tratamento, com responsáveis já acionados.',
  },
  resolved: {
    label: 'Resolvidas',
    description: 'Demandas concluídas e prontas para consulta histórica.',
  },
}