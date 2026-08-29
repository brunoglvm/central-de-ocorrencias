export type OccurrenceStatus = 'open' | 'in_progress' | 'resolved'

export type OccurrenceSource = 'resident' | 'employee'

export type Occurrence = {
  id: string
  title: string
  description: string
  image?: string | null
  createdAt: string
  status: OccurrenceStatus
  location: string
  source: OccurrenceSource
  archived: boolean
}