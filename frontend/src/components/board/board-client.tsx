'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import Image from 'next/image'
import { IconClock, IconHistory, IconMapPin, IconTrash, IconUser, IconUserCog, IconX } from '@tabler/icons-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BoardColumn } from '@/components/board/board-column'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { incidentColumns, statusMeta } from '@/constants/incidents'
import { groupIncidentsByStatus } from '@/lib/incidents'
import { readStoredIncidents, writeStoredIncidents } from '@/lib/incident-storage'
import type { Incident, IncidentStatus } from '@/types/incident'

type BoardClientProps = {
  initialIncidents: Incident[]
}

const statusBadgeVariants: Record<IncidentStatus, string> = {
  open: 'bg-status-open',
  in_progress: 'bg-status-progress',
  resolved: 'bg-status-resolved',
}

const statusLabels: Record<IncidentStatus, string> = {
  open: 'Abertas',
  in_progress: 'Em andamento',
  resolved: 'Resolvidas',
}

export function BoardClient({ initialIncidents }: BoardClientProps) {
  const [incidents, setIncidents] = useState(initialIncidents)
  const [isReady, setIsReady] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedIncidentId = searchParams.get('incident')
  const activeIncidents = useMemo(() => incidents.filter((incident) => !incident.archivedAt), [incidents])

  const incidentsByStatus = useMemo(() => groupIncidentsByStatus(activeIncidents), [activeIncidents])
  const selectedIncident = useMemo(
    () =>
      selectedIncidentId ? (activeIncidents.find((incident) => incident.id === selectedIncidentId) ?? null) : null,
    [activeIncidents, selectedIncidentId],
  )

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIncidents(readStoredIncidents(initialIncidents))
      setIsReady(true)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [initialIncidents])

  useEffect(() => {
    if (!isReady) {
      return
    }

    writeStoredIncidents(incidents)
  }, [incidents, isReady])

  function handleSelectIncident(incidentId: string) {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('incident', incidentId)
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  function handleCloseDetails() {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('incident')
    router.push(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname)
  }

  useEffect(() => {
    if (!selectedIncidentId) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.delete('incident')
        router.push(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIncidentId, pathname, router, searchParams])

  useEffect(() => {
    if (!selectedIncidentId || selectedIncident) {
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('incident')
    router.replace(nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname)
  }, [pathname, router, searchParams, selectedIncident, selectedIncidentId])

  function handleDragEnd(result: DropResult) {
    const { destination, source } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    setIncidents((currentIncidents) => {
      const archivedIncidents = currentIncidents.filter((incident) => incident.archivedAt)
      const activeCurrentIncidents = currentIncidents.filter((incident) => !incident.archivedAt)
      const grouped = groupIncidentsByStatus(activeCurrentIncidents)
      const sourceStatus = source.droppableId as IncidentStatus
      const destinationStatus = destination.droppableId as IncidentStatus
      const sourceItems = [...grouped[sourceStatus]]
      const destinationItems = sourceStatus === destinationStatus ? sourceItems : [...grouped[destinationStatus]]

      const [movedIncident] = sourceItems.splice(source.index, 1)

      if (!movedIncident) {
        return currentIncidents
      }

      destinationItems.splice(destination.index, 0, {
        ...movedIncident,
        status: destinationStatus,
      })

      const nextGroups = {
        ...grouped,
        [sourceStatus]: sourceItems,
        [destinationStatus]: destinationItems,
      }

      return [...incidentColumns.flatMap((status) => nextGroups[status]), ...archivedIncidents]
    })
  }

  function handleArchiveIncident() {
    if (!selectedIncident) {
      return
    }

    setIncidents((currentIncidents) =>
      currentIncidents.map((incident) =>
        incident.id === selectedIncident.id ? { ...incident, archivedAt: new Date().toISOString() } : incident,
      ),
    )
    handleCloseDetails()
    router.push('/admin/historico')
  }

  function handleRequestRemoveIncident() {
    setIsRemoveModalOpen(true)
  }

  function handleRemoveIncident() {
    if (!selectedIncident) {
      return
    }

    setIncidents((currentIncidents) => currentIncidents.filter((incident) => incident.id !== selectedIncident.id))
    setIsRemoveModalOpen(false)
    handleCloseDetails()
  }

  return (
    <section className='w-full'>
      {isMounted ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className='overflow-x-auto pb-6'>
            <div className='mx-auto flex min-w-full justify-center gap-5'>
              {incidentColumns.map((status) => (
                <BoardColumn
                  key={status}
                  status={status}
                  title={statusMeta[status].label}
                  incidents={incidentsByStatus[status]}
                  onSelectIncident={handleSelectIncident}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      ) : (
        <div className='overflow-x-auto pb-6'>
          <div className='mx-auto flex min-w-full justify-center gap-5'>
            {incidentColumns.map((status) => (
              <section
                key={status}
                className='flex h-[calc(100vh-10rem)] w-sm shrink-0 flex-col rounded-[1.25rem] bg-surface-container-low p-3'
              >
                <div className='flex items-center justify-between px-2 pt-1 pb-3'>
                  <div className={`inline-flex items-center gap-2 text-base font-semibold`}>
                    <span className='size-4 rounded-full border-2 border-current bg-current/15' />
                    <p>{statusMeta[status].label}</p>
                  </div>
                  <span className='inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-highest px-1.5 text-xs text-foreground-muted'>
                    {incidentsByStatus[status].length}
                  </span>
                </div>

                <div className='min-h-24 flex-1 space-y-3 overflow-y-auto rounded-2xl p-1 pr-2'>
                  {incidentsByStatus[status].map((incident) => (
                    <div key={incident.id} className='rounded-2xl bg-surface-container-lowest p-4'>
                      <button
                        type='button'
                        className='line-clamp-2 cursor-pointer text-left text-sm leading-5 font-medium decoration-primary-hover underline-offset-4 transition-colors hover:text-primary-hover hover:underline'
                        onClick={() => handleSelectIncident(incident.id)}
                      >
                        {incident.title}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {selectedIncident ? (
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
                <h2 className='pr-8 text-4xl tracking-[-0.04em] sm:pr-10'>{selectedIncident.title}</h2>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-foreground-inverse ${statusBadgeVariants[selectedIncident.status]}`}
                >
                  <span className='size-4 rounded-full border-2 border-foreground-inverse bg-surface-container-lowest/20' />
                  <span>{statusLabels[selectedIncident.status]}</span>
                </div>

                <div className='border-t border-foreground/8 pt-5'>
                  <div className='rounded-[1.25rem] border border-foreground/8 p-4'>
                    <div className='flex items-center gap-2 text-sm text-foreground-muted'>
                      {selectedIncident.userType === 'staff' ? (
                        <IconUserCog className='size-4' stroke={1.8} />
                      ) : (
                        <IconUser className='size-4' stroke={1.8} />
                      )}
                      <p>
                        <span>Registrado por: </span>
                        <span className='font-medium text-primary-hover'>
                          {selectedIncident.userType === 'resident' ? 'Morador' : 'Funcionário'}
                        </span>
                      </p>
                    </div>

                    <p className='mt-4 text-sm leading-7 text-foreground-muted'>{selectedIncident.description}</p>

                    {selectedIncident.hasAttachment && selectedIncident.attachmentUrl ? (
                      <div className='mt-4 overflow-hidden rounded-[1.125rem] border border-foreground/8'>
                        <Image
                          src={selectedIncident.attachmentUrl}
                          alt={selectedIncident.attachmentName ?? 'Imagem anexada'}
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
                        <span>Localização: {selectedIncident.location}</span>
                      </span>
                      <span className='inline-flex items-center gap-1 rounded-full border border-foreground/8 px-3 py-1.5 text-xs text-foreground-muted'>
                        <IconClock className='size-4' stroke={1.8} />
                        <span>Data: {selectedIncident.createdAt}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                <Button variant='danger' onClick={handleRequestRemoveIncident}>
                  <span className='inline-flex items-center gap-2'>
                    <IconTrash className='size-4.5' stroke={1.8} />
                    Remover ocorrência
                  </span>
                </Button>

                <Button type='button' onClick={handleArchiveIncident}>
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

      {selectedIncident ? (
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
                <h2 className='pr-8 text-4xl tracking-[-0.04em] sm:pr-10'>{selectedIncident.title}</h2>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-foreground-inverse ${statusBadgeVariants[selectedIncident.status]}`}
                >
                  <span className='size-4 rounded-full border-2 border-foreground-inverse bg-surface-container-lowest/20' />
                  <span>{statusLabels[selectedIncident.status]}</span>
                </div>

                <div className='border-t border-foreground/8 pt-5'>
                  <div className='rounded-[1.25rem] border border-foreground/8 p-4'>
                    <div className='flex items-center gap-2 text-sm text-foreground-muted'>
                      {selectedIncident.userType === 'staff' ? (
                        <IconUserCog className='size-4' stroke={1.8} />
                      ) : (
                        <IconUser className='size-4' stroke={1.8} />
                      )}
                      <p>
                        <span>Registrado por: </span>
                        <span className='font-medium text-primary-hover'>
                          {selectedIncident.userType === 'resident' ? 'Morador' : 'Funcionário'}
                        </span>
                      </p>
                    </div>

                    <p className='mt-4 text-sm leading-7 text-foreground-muted'>{selectedIncident.description}</p>

                    {selectedIncident.hasAttachment && selectedIncident.attachmentUrl ? (
                      <div className='mt-4 overflow-hidden rounded-[1.125rem] border border-foreground/8'>
                        <Image
                          src={selectedIncident.attachmentUrl}
                          alt={selectedIncident.attachmentName ?? 'Imagem anexada'}
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
                        <span>Localização: {selectedIncident.location}</span>
                      </span>
                      <span className='inline-flex items-center gap-1 rounded-full border border-foreground/8 px-3 py-1.5 text-xs text-foreground-muted'>
                        <IconClock className='size-4' stroke={1.8} />
                        <span>Data: {selectedIncident.createdAt}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                <Button variant='danger' onClick={handleRequestRemoveIncident}>
                  <span className='inline-flex items-center gap-2'>
                    <IconTrash className='size-4.5' stroke={1.8} />
                    Remover ocorrência
                  </span>
                </Button>

                <Button type='button' onClick={handleArchiveIncident}>
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

      <Modal
        isOpen={isRemoveModalOpen}
        title='Remover ocorrência?'
        description='Essa ação exclui a ocorrência do quadro e do histórico local deste navegador.'
        confirmLabel='Remover'
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemoveIncident}
      />
    </section>
  )
}
