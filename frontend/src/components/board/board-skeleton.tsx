import { occurrenceColumns, statusMeta } from '@/constants/occurrences'

const statusIndicatorVariants: Record<string, string> = {
  open: 'text-status-open',
  in_progress: 'text-status-progress',
  resolved: 'text-status-resolved',
}

export function BoardSkeleton() {
  return (
    <div className='overflow-x-auto pb-6'>
      <div className='mx-auto flex w-max min-w-full justify-center gap-5 px-4 sm:px-0'>
        {occurrenceColumns.map((status) => (
          <section
            key={status}
            className='flex h-[calc(100vh-10rem)] w-sm shrink-0 flex-col rounded-[1.25rem] bg-surface-container-low p-3'
          >
            <div className='flex items-center justify-between px-2 pt-1 pb-3'>
              <div
                className={`inline-flex items-center gap-2 text-base font-semibold ${statusIndicatorVariants[status]}`}
              >
                <span className='size-4 rounded-full border-2 border-current bg-current/15' />
                <p>{statusMeta[status].label}</p>
              </div>
              <span className='inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-highest px-1.5 text-xs text-foreground-muted'>
                <span className='size-3 animate-pulse rounded-full bg-foreground-muted/30' />
              </span>
            </div>

            <div className='min-h-24 flex-1 space-y-3 overflow-y-auto rounded-2xl p-1 pr-2'>
              <div className='rounded-2xl bg-surface-container-lowest p-4'>
                <span className='block h-4 w-3/4 animate-pulse rounded-full bg-surface-container-highest' />
              </div>
              <div className='rounded-2xl bg-surface-container-lowest p-4'>
                <span className='block h-4 w-1/2 animate-pulse rounded-full bg-surface-container-highest' />
              </div>
              <div className='rounded-2xl bg-surface-container-lowest p-4'>
                <span className='block h-4 w-2/3 animate-pulse rounded-full bg-surface-container-highest' />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
