'use client'

import { Draggable } from '@hello-pangea/dnd'
import { IconClock, IconMapPin } from '@tabler/icons-react'
import type { Occurrence } from '@/types/occurrence'

type OccurrenceCardProps = {
  occurrence: Occurrence
  index: number
  onSelect: (occurrenceId: string) => void
}

export function OccurrenceCard({ occurrence, index, onSelect }: OccurrenceCardProps) {
  return (
    <Draggable draggableId={occurrence.id} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={
            snapshot.isDragging
              ? 'rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-foreground/5'
              : 'rounded-2xl bg-surface-container-lowest p-4'
          }
        >
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <button
                type='button'
                className='line-clamp-2 cursor-pointer text-left text-sm leading-5 font-medium decoration-primary-hover underline-offset-4 transition-colors hover:text-primary-hover hover:underline'
                onClick={() => onSelect(occurrence.id)}
              >
                {occurrence.title}
              </button>
            </div>
          </div>

          <p className='mt-2 line-clamp-2 text-xs leading-5 text-foreground-muted'>{occurrence.description}</p>

          <div className='mt-3 flex flex-wrap items-center gap-3 text-xs text-foreground-muted'>
            <span className='inline-flex items-center gap-1'>
              <IconMapPin className='size-4' stroke={1.8} />
              {occurrence.location}
            </span>
            <span className='inline-flex items-center gap-1 border-l border-foreground/12 pl-3'>
              <IconClock className='size-4' stroke={1.8} />
              {occurrence.createdAt}
            </span>
          </div>
        </article>
      )}
    </Draggable>
  )
}