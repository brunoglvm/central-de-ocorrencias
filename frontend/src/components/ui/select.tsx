'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export type SelectOption = {
  label: string
  value: string
}

type SelectProps = {
  className?: string
  error?: string
  id?: string
  label: string
  onBlur?: () => void
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  value?: string
}

export function Select({
  className,
  error,
  id,
  label,
  onBlur,
  onValueChange,
  options,
  placeholder = 'Selecione',
  value,
}: SelectProps) {
  const reactId = useId()
  const selectId = id ?? `${label.toLowerCase().replace(/\s+/g, '-')}-${reactId}`
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function handleSelect(nextValue: string) {
    onValueChange(nextValue)
    onBlur?.()
    setIsOpen(false)
  }

  return (
    <label className="block space-y-2" htmlFor={selectId}>
      <span className="text-sm text-foreground-muted">{label}</span>

      <div className="relative" ref={containerRef}>
        <button
          id={selectId}
          type="button"
          aria-controls={`${selectId}-listbox`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            'flex min-h-12 w-full cursor-pointer items-center justify-between rounded-2xl bg-surface-container-lowest px-4 py-3 text-left text-sm transition-colors outline-none focus:ring-2 focus:ring-[rgba(62,98,103,0.2)]',
            error && 'ring-2 ring-[rgba(185,28,28,0.18)]',
            className,
          )}
          onBlur={() => {
            onBlur?.()
          }}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className={cn(!selectedOption && 'text-foreground-muted')}>{selectedOption?.label ?? placeholder}</span>
          <IconChevronDown
            className={cn('size-4 text-foreground-muted transition-transform', isOpen && 'rotate-180')}
            stroke={1.8}
          />
        </button>

        {isOpen ? (
          <div
            id={`${selectId}-listbox`}
            role="listbox"
            className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-2xl bg-surface-container-lowest p-2 shadow-ambient"
          >
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    'flex w-full cursor-pointer items-center rounded-2xl p-3 text-left text-sm transition-colors',
                    isSelected ? 'bg-surface-container-highest' : 'hover:bg-surface-container-lowest',
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-danger-strong">{error}</p> : null}
    </label>
  )
}
