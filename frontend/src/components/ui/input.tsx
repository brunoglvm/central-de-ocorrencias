import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  endAdornment?: React.ReactNode
  error?: string
  label: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, endAdornment, error, label, id, ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="text-sm text-foreground-muted">{label}</span>
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm outline-none placeholder:text-foreground-muted',
            endAdornment ? 'pr-12' : '',
            error && 'ring-2 ring-[rgba(185,28,28,0.18)]',
            className,
          )}
          {...props}
        />

        {endAdornment ? <div className="absolute inset-y-0 right-0 flex items-center pr-4">{endAdornment}</div> : null}
      </div>

      {error ? <p className="text-sm text-danger-strong">{error}</p> : null}
    </label>
  )
})
