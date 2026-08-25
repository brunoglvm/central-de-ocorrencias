import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BoardClient } from '@/components/board/board-client'
import { mockIncidents } from '@/data/mock-incidents'

export const metadata: Metadata = {
  title: 'Quadro',
}

export default function AdminBoardPage() {
  return (
    <Suspense fallback={null}>
      <BoardClient initialIncidents={mockIncidents} />
    </Suspense>
  )
}
