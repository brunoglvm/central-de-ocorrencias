'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { IconX } from '@tabler/icons-react'

type ImagePreviewModalProps = {
  fileName: string
  imageUrl: string
  isOpen: boolean
  onClose: () => void
}

export function ImagePreviewModal({ fileName, imageUrl, isOpen, onClose }: ImagePreviewModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Fechar visualizacao da imagem"
        className="absolute inset-0 bg-[rgba(25,28,28,0.72)] backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-fit max-w-[min(92vw,64rem)] flex-col gap-3">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Fechar visualizacao"
            className="flex size-8 cursor-pointer items-center justify-center text-white transition-colors hover:text-surface-container-highest"
            onClick={onClose}
          >
            <IconX className="size-5" stroke={1.8} />
          </button>
        </div>

        <div className="flex w-fit max-w-full flex-1 items-center justify-center overflow-hidden rounded-[1.75rem] bg-foreground-inverse shadow-ambient">
          <Image
            src={imageUrl}
            alt={fileName || 'Imagem anexada'}
            width={1200}
            height={900}
            className="size-auto max-h-[calc(90vh-5.5rem)] max-w-full object-contain"
            unoptimized
          />
        </div>

        <div className="max-w-full min-w-0 truncate text-sm text-white">{fileName}</div>
      </div>
    </div>,
    document.body,
  )
}
