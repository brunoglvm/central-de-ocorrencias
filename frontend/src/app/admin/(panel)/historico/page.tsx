import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HistoryClient } from '@/components/history/history-client'
import { mockIncidents } from '@/data/mock-incidents'

export const metadata: Metadata = {
  title: 'Histórico',
}

export default function AdminHistoryPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <HistoryClient initialIncidents={mockIncidents} />
      </Suspense>
    </div>
  )
}
