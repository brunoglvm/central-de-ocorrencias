export type IncidentStatus = 'open' | 'in_progress' | 'resolved'

export type IncidentSource = 'resident' | 'employee'

export type Incident = {
  id: string
  title: string
  description: string
  image?: string | null
  createdAt: string
  status: IncidentStatus
  location: string
  source: IncidentSource
  archivedAt?: string | null
}
