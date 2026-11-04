'use client'

import { Draggable } from '@hello-pangea/dnd'
import { IconClock, IconMapPin } from '@tabler/icons-react'
import { formatOccurrenceDate } from '@/lib/occurrences'
import type { Occurrence } from '@/types/occurrence'

type OccurrenceCardProps = {
  occurrence: Occurrence
  index: number
  onSelect: (occurrenceId: number) => void
}

export function OccurrenceCard({ occurrence, index, onSelect }: OccurrenceCardProps) {
  return (
    <Draggable draggableId={String(occurrence.id)} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={
            snapshot.isDragging
              ? 'w-full max-w-full min-w-0 cursor-grabbing overflow-hidden rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-foreground/5'
              : 'w-full max-w-full min-w-0 cursor-grab overflow-hidden rounded-2xl bg-surface-container-lowest p-4 active:cursor-grabbing'
          }
        >
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <button
                type='button'
                className='line-clamp-2 w-full max-w-full cursor-pointer overflow-hidden text-left text-sm leading-5 font-medium wrap-break-word decoration-primary-hover underline-offset-2 transition-colors hover:text-primary-hover hover:underline active:cursor-grabbing'
                onClick={() => onSelect(occurrence.id)}
              >
                {occurrence.title}
              </button>
            </div>
          </div>

          <p className='mt-2 line-clamp-3 w-full max-w-full overflow-hidden text-xs leading-5 wrap-break-word text-foreground-muted'>
            {occurrence.description}
          </p>

          <div className='mt-3 flex flex-wrap items-center gap-3 text-xs text-foreground-muted'>
            <span className='inline-flex max-w-full min-w-0 items-center gap-1'>
              <IconMapPin className='size-4 shrink-0' stroke={1.8} />
              <span className='truncate'>{occurrence.location}</span>
            </span>
            <span className='inline-flex items-center gap-1 border-l border-foreground/12 pl-3'>
              <IconClock className='size-4' stroke={1.8} />
              {formatOccurrenceDate(occurrence.createdAt)}
            </span>
          </div>
        </article>
      )}
    </Draggable>
  )
}
