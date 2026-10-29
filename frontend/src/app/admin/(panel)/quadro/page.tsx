import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BoardClient } from '@/components/board/board-client'
import { requireServerAuthToken } from '@/lib/auth/session'
import { ApiError } from '@/services/api/client'
import { getOccurrences } from '@/services/api/occurrences'

export const metadata: Metadata = {
  title: 'Quadro',
}

export default async function AdminBoardPage() {
  const token = await requireServerAuthToken()
  const occurrences = await getOccurrences(token).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/admin')
    }

    throw error
  })

  return <BoardClient initialOccurrences={occurrences} />
}
