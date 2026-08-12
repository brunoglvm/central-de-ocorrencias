import { cn } from '@/lib/utils'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('bg-(--color-surface-container-low) shadow-ambient', className)} {...props} />
}
