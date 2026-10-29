'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { HistoryList } from '@/components/history/history-list'
import { historyPageSize } from '@/constants/occurrences'
import { getErrorMessage } from '@/lib/errors'
import { updateOccurrenceArchive } from '@/services/api/occurrences'
import type { Occurrence } from '@/types/occurrence'

type HistoryClientProps = {
  initialOccurrences: Occurrence[]
}

export function HistoryClient({ initialOccurrences }: HistoryClientProps) {
  const [occurrences, setOccurrences] = useState(initialOccurrences)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawPage = Number(searchParams.get('page') ?? '1')

  useEffect(() => {
    setOccurrences(initialOccurrences)
  }, [initialOccurrences])

  const archivedOccurrences = useMemo(
    () => occurrences.filter((occurrence) => Boolean(occurrence.archived)),
    [occurrences],
  )
  const totalPages = Math.max(1, Math.ceil(archivedOccurrences.length / historyPageSize))
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? Math.min(rawPage, totalPages) : 1
  const startIndex = (currentPage - 1) * historyPageSize
  const paginatedOccurrences = archivedOccurrences.slice(startIndex, startIndex + historyPageSize)

  useEffect(() => {
    if (rawPage === currentPage) {
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())

    if (currentPage <= 1) {
      nextParams.delete('page')
    } else {
      nextParams.set('page', String(currentPage))
    }

    router.replace(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname)
  }, [currentPage, pathname, rawPage, router, searchParams])

  async function handleRestoreOccurrence(occurrenceId: number) {
    const previousOccurrences = occurrences

    setErrorMessage(null)
    setOccurrences((current) =>
      current.map((occurrence) => (occurrence.id === occurrenceId ? { ...occurrence, archived: false } : occurrence)),
    )

    try {
      await updateOccurrenceArchive(occurrenceId, false)
      router.refresh()
    } catch (error) {
      setOccurrences(previousOccurrences)
      setErrorMessage(getErrorMessage(error, 'Não foi possível retornar a ocorrência para o quadro.'))
    }
  }

  return (
    <div className='space-y-4'>
      {errorMessage ? (
        <div role='alert' className='rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger-strong'>
          {errorMessage}
        </div>
      ) : null}

      <HistoryList
        currentPage={currentPage}
        occurrences={paginatedOccurrences}
        onRestoreOccurrence={handleRestoreOccurrence}
        totalItems={archivedOccurrences.length}
        totalPages={totalPages}
      />
    </div>
  )
}
