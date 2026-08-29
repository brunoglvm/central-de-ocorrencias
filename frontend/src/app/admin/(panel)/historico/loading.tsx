import { HistorySkeleton } from '@/components/history/history-skeleton'

export default function Loading() {
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <HistorySkeleton />
    </div>
  )
}
