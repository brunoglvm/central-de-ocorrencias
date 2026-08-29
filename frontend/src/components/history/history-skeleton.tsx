export function HistorySkeleton() {
  return (
    <section className='rounded-[2.25rem] bg-surface-container-low p-5 sm:p-6'>
      <div className='space-y-6'>
        {Array.from({ length: 3 }).map((_, index) => (
          <article
            key={index}
            className='grid gap-4 rounded-[1.75rem] bg-surface-container-lowest p-5 lg:grid-cols-[auto_1fr]'
          >
            <div className='flex items-start gap-4 lg:flex-col lg:items-center'>
              <div className='flex flex-col items-center'>
                <span className='size-3 rounded-full bg-surface-container-highest' />
                {index < 2 ? (
                  <span className='mt-2 h-20 w-px bg-linear-to-b from-surface-container-highest to-transparent' />
                ) : null}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start'>
                <div className='min-w-0 space-y-4'>
                  <span className='block h-7 w-2/3 animate-pulse rounded-full bg-surface-container-highest' />
                  <span className='block h-4 w-full animate-pulse rounded-full bg-surface-container-highest/60' />
                  <span className='block h-4 w-4/5 animate-pulse rounded-full bg-surface-container-highest/60' />
                </div>

                <span className='inline-flex h-10 w-24 shrink-0 animate-pulse rounded-2xl bg-surface-container-highest' />
              </div>

              <div className='flex items-center gap-3'>
                <span className='h-3 w-16 animate-pulse rounded-full bg-surface-container-highest' />
                <span className='h-3 w-20 animate-pulse rounded-full bg-surface-container-highest' />
                <span className='h-3 w-14 animate-pulse rounded-full bg-surface-container-highest' />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
