'use client'

import { Droppable } from '@hello-pangea/dnd'
import { IncidentCard } from '@/components/board/incident-card'
import type { Incident, IncidentStatus } from '@/types/incident'

type BoardColumnProps = {
  status: IncidentStatus
  title: string
  incidents: Incident[]
  onSelectIncident: (incidentId: string) => void
}

const statusIndicatorVariants: Record<IncidentStatus, string> = {
  open: 'text-status-open',
  in_progress: 'text-status-progress',
  resolved: 'text-status-resolved',
}

export function BoardColumn({ status, title, incidents, onSelectIncident }: BoardColumnProps) {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className='flex h-[calc(100vh-10rem)] w-sm shrink-0 flex-col rounded-[1.25rem] bg-surface-container-low p-3'
        >
          <div className='flex items-center justify-between px-2 pt-1 pb-3'>
            <div
              className={`inline-flex items-center gap-2 text-base font-semibold ${statusIndicatorVariants[status]}`}
            >
              <span className='size-4 rounded-full border-2 border-current bg-current/15' />
              <p>{title}</p>
            </div>
            <span className='inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-highest px-1.5 text-xs text-foreground-muted'>
              {incidents.length}
            </span>
          </div>

          <div className='min-h-24 flex-1 space-y-3 overflow-y-auto rounded-2xl p-1 pr-2 transition-colors'>
            {incidents.map((incident, index) => (
              <IncidentCard key={incident.id} incident={incident} index={index} onSelect={onSelectIncident} />
            ))}
            {provided.placeholder}
          </div>
        </section>
      )}
    </Droppable>
  )
}
