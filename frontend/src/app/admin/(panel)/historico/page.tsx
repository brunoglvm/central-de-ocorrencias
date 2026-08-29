import type { Metadata } from 'next'
import { HistoryClient } from '@/components/history/history-client'
import { mockIncidents } from '@/data/mock-incidents'

export const metadata: Metadata = {
  title: 'Histórico',
}

export default async function AdminHistoryPage() {
  // const incidents = await fetchIncidents()

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <HistoryClient initialIncidents={mockIncidents} />
    </div>
  )
}
