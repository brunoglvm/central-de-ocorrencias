export type OccurrenceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

export type OccurrenceSource = 'EMPLOYEE' | 'RESIDENT'

export type Occurrence = {
  id: number
  title: string
  description: string
  image: string | null
  createdAt: string
  status: OccurrenceStatus
  location: string
  source: OccurrenceSource
  archived: boolean
}

export type CreateOccurrenceInput = {
  title: string
  description: string
  location: string
  source: OccurrenceSource
  image?: File | null
}
