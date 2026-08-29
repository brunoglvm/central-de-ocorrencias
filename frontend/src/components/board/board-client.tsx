'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import Image from 'next/image'
import { IconClock, IconHistory, IconMapPin, IconTrash, IconUser, IconUserCog, IconX } from '@tabler/icons-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BoardColumn } from '@/components/board/board-column'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { occurrenceColumns, statusMeta } from '@/constants/occurrences'
import { getImageFileName, groupOccurrencesByStatus } from '@/lib/occurrences'
import type { Occurrence, OccurrenceStatus } from '@/types/occurrence'

type BoardClientProps = {
  initialOccurrences: Occurrence[]
}

const statusBadgeVariants: Record<OccurrenceStatus, string> = {
  open: 'bg-status-open',
  in_progress: 'bg-status-progress',
  resolved: 'bg-status-resolved',
}

const statusLabels: Record<OccurrenceStatus, string> = {
  open: 'Abertas',
  in_progress: 'Em andamento',
  resolved: 'Resolvidas',
}

export function BoardClient({ initialOccurrences }: BoardClientProps) {
  const [occurrences, setOccurrences] = useState(initialOccurrences)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedOccurrenceId = searchParams.get('occurrence')
  const activeOccurrences = useMemo(() => occurrences.filter((occurrence) => !occurrence.archivedAt), [occurrences])
  const occurrencesByStatus = useMemo(() => groupOccurrencesByStatus(activeOccurrences), [activeOccurrences])
  const selectedOccurrence = useMemo(
    () =>
      selectedOccurrenceId
        ? (activeOccurrences.find((occurrence) => occurrence.id === selectedOccurrenceId) ?? null)
        : null,
    [activeOccurrences, selectedOccurrenceId],
  )

  function handleSelectOccurrence(occurrenceId: string) {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('occurrence', occurrenceId)
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  function handleCloseDetails() {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('occurrence')
    router.push(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname)
  }

  useEffect(() => {
    if (!selectedOccurrenceId) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.delete('occurrence')
        router.push(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedOccurrenceId, pathname, router, searchParams])

  useEffect(() => {
    if (!selectedOccurrenceId || selectedOccurrence) {
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('occurrence')
    router.replace(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname)
  }, [pathname, router, searchParams, selectedOccurrence, selectedOccurrenceId])

  function handleDragEnd(result: DropResult) {
    const { destination, source } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    setOccurrences((currentOccurrences) => {
      const archivedOccurrences = currentOccurrences.filter((occurrence) => occurrence.archivedAt)
      const activeCurrentOccurrences = currentOccurrences.filter((occurrence) => !occurrence.archivedAt)
      const grouped = groupOccurrencesByStatus(activeCurrentOccurrences)
      const sourceStatus = source.droppableId as OccurrenceStatus
      const destinationStatus = destination.droppableId as OccurrenceStatus
      const sourceItems = [...grouped[sourceStatus]]
      const destinationItems = sourceStatus === destinationStatus ? sourceItems : [...grouped[destinationStatus]]

      const [movedOccurrence] = sourceItems.splice(source.index, 1)

      if (!movedOccurrence) {
        return currentOccurrences
      }

      destinationItems.splice(destination.index, 0, {
        ...movedOccurrence,
        status: destinationStatus,
      })

      const nextGroups = {
        ...grouped,
        [sourceStatus]: sourceItems,
        [destinationStatus]: destinationItems,
      }

      return [...occurrenceColumns.flatMap((status) => nextGroups[status]), ...archivedOccurrences]
    })
  }

  function handleArchiveOccurrence() {
    if (!selectedOccurrence) {
      return
    }

    setOccurrences((currentOccurrences) =>
      currentOccurrences.map((occurrence) =>
        occurrence.id === selectedOccurrence.id ? { ...occurrence, archivedAt: new Date().toISOString() } : occurrence,
      ),
    )
    handleCloseDetails()
    router.push('/admin/historico')
  }

  function handleRequestRemoveOccurrence() {
    setIsRemoveModalOpen(true)
  }

  function handleRemoveOccurrence() {
    if (!selectedOccurrence) {
      return
    }

    setOccurrences((currentOccurrences) =>
      currentOccurrences.filter((occurrence) => occurrence.id !== selectedOccurrence.id),
    )
    setIsRemoveModalOpen(false)
    handleCloseDetails()
  }

  return (
    <section className='w-full'>
      {isMounted ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='overflow-x-auto pb-6'>
            <div className='mx-auto flex w-max min-w-full justify-center gap-5 px-4 sm:px-0'>
              {occurrenceColumns.map((status) => (
                <BoardColumn
                  key={status}
                  status={status}
                  title={statusMeta[status].label}
                  occurrences={occurrencesByStatus[status]}
                  onSelectOccurrence={handleSelectOccurrence}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      ) : null}

      {selectedOccurrence ? (
        <div className='pointer-events-none fixed inset-x-0 top-15.25 bottom-0 z-80 hidden lg:block'>
          <button
            type='button'
            aria-label='Fechar detalhes da ocorrência'
            className='pointer-events-auto absolute inset-0'
            onClick={handleCloseDetails}
          />

          {/* Desktop */}
          <aside className='pointer-events-auto absolute inset-y-0 right-0 flex w-full max-w-160 sheet-enter flex-col rounded-l-[1.25rem] border border-r-0 border-foreground/8 bg-surface-container-lowest'>
            <div className='-mb-3 flex items-center justify-end rounded-tl-[1.25rem] px-5 pt-3 sm:px-6 sm:pt-4'>
              <button
                type='button'
                aria-label='Fechar painel lateral'
                className='flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-foreground'
                onClick={handleCloseDetails}
              >
                <IconX className='size-5' stroke={1.8} />
              </button>
            </div>
            <div className='flex-1 space-y-4 overflow-y-auto px-5 pt-0 pb-5 sm:px-6 sm:pt-0 sm:pb-6'>
              <div className='space-y-4'>
                <h2 className='pr-8 text-4xl tracking-[-0.04em] sm:pr-10'>{selectedOccurrence.title}</h2>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-foreground-inverse ${statusBadgeVariants[selectedOccurrence.status]}`}
                >
                  <span className='size-4 rounded-full border-2 border-foreground-inverse bg-surface-container-lowest/20' />
                  <span>{statusLabels[selectedOccurrence.status]}</span>
                </div>

                <div className='border-t border-foreground/8 pt-5'>
                  <div className='rounded-[1.25rem] border border-foreground/8 p-4'>
                    <div className='flex items-center gap-2 text-sm text-foreground-muted'>
                      {selectedOccurrence.source === 'employee' ? (
                        <IconUserCog className='size-4' stroke={1.8} />
                      ) : (
                        <IconUser className='size-4' stroke={1.8} />
                      )}
                      <p>
                        <span>Registrado por: </span>
                        <span className='font-medium text-primary-hover'>
                          {selectedOccurrence.source === 'resident' ? 'Morador' : 'Funcionário'}
                        </span>
                      </p>
                    </div>

                    <p className='mt-4 text-sm leading-7 text-foreground-muted'>{selectedOccurrence.description}</p>

                    {selectedOccurrence.image ? (
                      <div className='mt-4 overflow-hidden rounded-[1.125rem] border border-foreground/8'>
                        <Image
                          src={selectedOccurrence.image ?? ''}
                          alt={getImageFileName(selectedOccurrence.image)}
                          width={1200}
                          height={800}
                          className='h-auto w-full object-contain'
                          unoptimized
                        />
                      </div>
                    ) : null}

                    <div className='mt-3 flex flex-wrap gap-2'>
                      <span className='inline-flex items-center gap-1 rounded-full border border-foreground/8 px-3 py-1.5 text-xs text-foreground-muted'>
                        <IconMapPin className='size-4' stroke={1.8} />
                        <span>Localização: {selectedOccurrence.location}</span>
                      </span>
                      <span className='inline-flex items-center gap-1 rounded-full border border-foreground/8 px-3 py-1.5 text-xs text-foreground-muted'>
                        <IconClock className='size-4' stroke={1.8} />
                        <span>Data: {selectedOccurrence.createdAt}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                <Button variant='danger' onClick={handleRequestRemoveOccurrence}>
                  <span className='inline-flex items-center gap-2'>
                    <IconTrash className='size-4.5' stroke={1.8} />
                    Remover ocorrência
                  </span>
                </Button>

                <Button type='button' onClick={handleArchiveOccurrence}>
                  <span className='inline-flex items-center gap-2'>
                    <IconHistory className='size-4.5' stroke={1.8} />
                    Mover para histórico
                  </span>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {selectedOccurrence ? (
        <div className='fixed inset-0 z-80 lg:hidden'>
          <button
            type='button'
            aria-label='Fechar detalhes da ocorrencia'
            className='absolute inset-0 bg-foreground/28 backdrop-blur-[.125rem]'
            onClick={handleCloseDetails}
          />

          {/* Mobile */}
          <aside className='absolute inset-y-0 right-0 flex w-full max-w-160 sheet-enter flex-col border-l border-foreground/8 bg-surface-container-lowest sm:w-160'>
            <div className='-mb-3 flex items-center justify-end px-5 pt-3 sm:px-6 sm:pt-4'>
              <button
                type='button'
                aria-label='Fechar painel lateral'
                className='flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-foreground'
                onClick={handleCloseDetails}
              >
                <IconX className='size-5' stroke={1.8} />
              </button>
            </div>
            <div className='flex-1 space-y-4 overflow-y-auto px-5 pt-0 pb-5 sm:px-6 sm:pt-0 sm:pb-6'>
              <div className='space-y-4'>
                <h2 className='pr-8 text-4xl tracking-[-0.04em] sm:pr-10'>{selectedOccurrence.title}</h2>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-foreground-inverse ${statusBadgeVariants[selectedOccurrence.status]}`}
                >
                  <span className='size-4 rounded-full border-2 border-foreground-inverse bg-surface-container-lowest/20' />
                  <span>{statusLabels[selectedOccurrence.status]}</span>
                </div>

                <div className='border-t border-foreground/8 pt-5'>
                  <div className='rounded-[1.25rem] border border-foreground/8 p-4'>
                    <div className='flex items-center gap-2 text-sm text-foreground-muted'>
                      {selectedOccurrence.source === 'employee' ? (
                        <IconUserCog className='size-4' stroke={1.8} />
                      ) : (
                        <IconUser className='size-4' stroke={1.8} />
                      )}
                      <p>
                        <span>Registrado por: </span>
                        <span className='font-medium text-primary-hover'>
                          {selectedOccurrence.source === 'resident' ? 'Morador' : 'Funcionário'}
                        </span>
                      </p>
                    </div>

                    <p className='mt-4 text-sm leading-7 text-foreground-muted'>{selectedOccurrence.description}</p>

                    {selectedOccurrence.image ? (
                      <div className='mt-4 overflow-hidden rounded-[1.125rem] border border-foreground/8'>
                        <Image
                          src={selectedOccurrence.image ?? ''}
                          alt={getImageFileName(selectedOccurrence.image)}
                          width={1200}
                          height={800}
                          className='h-auto w-full object-contain'
                          unoptimized
                        />
                      </div>
                    ) : null}

                    <div className='mt-3 flex flex-wrap gap-2'>
                      <span className='inline-flex items-center gap-1 rounded-full border border-foreground/8 px-3 py-1.5 text-xs text-foreground-muted'>
                        <IconMapPin className='size-4' stroke={1.8} />
                        <span>Localização: {selectedOccurrence.location}</span>
                      </span>
                      <span className='inline-flex items-center gap-1 rounded-full border border-foreground/8 px-3 py-1.5 text-xs text-foreground-muted'>
                        <IconClock className='size-4' stroke={1.8} />
                        <span>Data: {selectedOccurrence.createdAt}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                <Button type='button' onClick={handleArchiveOccurrence}>
                  <span className='inline-flex items-center gap-2'>
                    <IconHistory className='size-4.5' stroke={1.8} />
                    Mover para histórico
                  </span>
                </Button>

                <Button variant='danger' onClick={handleRequestRemoveOccurrence}>
                  <span className='inline-flex items-center gap-2'>
                    <IconTrash className='size-4.5' stroke={1.8} />
                    Remover ocorrência
                  </span>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <Modal
        isOpen={isRemoveModalOpen}
        title='Remover ocorrência?'
        description='Essa ação exclui a ocorrência do quadro e do histórico local deste navegador.'
        confirmLabel='Remover'
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemoveOccurrence}
      />
    </section>
  )
}