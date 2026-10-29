import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { HistoryClient } from '@/components/history/history-client'
import { requireServerAuthToken } from '@/lib/auth/session'
import { ApiError } from '@/services/api/client'
import { getOccurrences } from '@/services/api/occurrences'

export const metadata: Metadata = {
  title: 'Histórico',
}

export default async function AdminHistoryPage() {
  const token = await requireServerAuthToken()
  const occurrences = await getOccurrences(token).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/admin')
    }

    throw error
  })

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <HistoryClient initialOccurrences={occurrences} />
    </div>
  )
}
