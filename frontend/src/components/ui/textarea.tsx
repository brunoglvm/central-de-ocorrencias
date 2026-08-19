import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
  label: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, id, label, ...props },
  ref,
) {
  const textareaId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className='block space-y-2' htmlFor={textareaId}>
      <span className='text-sm text-foreground-muted'>{label}</span>
      <textarea
        id={textareaId}
        ref={ref}
        className={cn(
          'min-h-40 w-full resize-none rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm leading-7 outline-none placeholder:text-foreground-muted focus:ring-2 focus:ring-primary-hover/20',
          error && 'ring-2 ring-danger-strong/18',
          className,
        )}
        {...props}
      />

      {error ? <p className='text-sm text-danger-strong'>{error}</p> : null}
    </label>
  )
})
