import type { Metadata } from 'next'
import { HistoryClient } from '@/components/history/history-client'
import { mockOccurrences } from '@/data/mock-occurrences'

export const metadata: Metadata = {
  title: 'Histórico',
}

export default async function AdminHistoryPage() {
  // const occurrences = await fetchOccurrences()

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <HistoryClient initialOccurrences={mockOccurrences} />
    </div>
  )
}
