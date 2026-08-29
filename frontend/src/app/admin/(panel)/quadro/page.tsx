import type { Metadata } from 'next'
import { BoardClient } from '@/components/board/board-client'
import { mockIncidents } from '@/data/mock-incidents'
// import { fetchIncidents } from '@/services/api/fetch-incident'

export const metadata: Metadata = {
  title: 'Quadro',
}

export default async function AdminBoardPage() {
  // const incidents = await fetchIncidents()
  const incidents = mockIncidents

  return <BoardClient initialIncidents={incidents} />
}
