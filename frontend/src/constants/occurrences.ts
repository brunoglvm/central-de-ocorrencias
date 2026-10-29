import type { OccurrenceStatus } from '@/types/occurrence'

export const occurrenceColumns: OccurrenceStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

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
  OPEN: {
    label: 'Abertas',
    description: 'Ocorrências recém-registradas aguardando triagem inicial.',
  },
  IN_PROGRESS: {
    label: 'Em andamento',
    description: 'Casos em tratamento, com responsáveis já acionados.',
  },
  RESOLVED: {
    label: 'Resolvidas',
    description: 'Demandas concluídas e prontas para consulta histórica.',
  },
}
