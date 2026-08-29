import type { Metadata } from 'next'
import { BoardClient } from '@/components/board/board-client'
import { mockOccurrences } from '@/data/mock-occurrences'
// import { fetchOccurrences } from '@/services/api/fetch-occurrence'

export const metadata: Metadata = {
  title: 'Quadro',
}

export default async function AdminBoardPage() {
  // const occurrences = await fetchOccurrences()
  const occurrences = mockOccurrences

  return <BoardClient initialOccurrences={occurrences} />
}
