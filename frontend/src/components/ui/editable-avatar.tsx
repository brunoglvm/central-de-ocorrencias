'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { IconPhoto } from '@tabler/icons-react'
import { Tooltip } from '@/components/ui/tooltip'
import { imageUploadAcceptAttribute } from '@/constants/image-upload'

type EditableAvatarProps = {
  alt: string
  className?: string
  initialSrc: string
  onUpload?: (file: File) => Promise<void>
  size?: number
}

export function EditableAvatar({ alt, className, initialSrc, onUpload, size = 40 }: EditableAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewSrc, setPreviewSrc] = useState(initialSrc)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    setPreviewSrc(initialSrc)
  }, [initialSrc])

  useEffect(() => {
    return () => {
      if (previewSrc.startsWith('blob:')) {
        URL.revokeObjectURL(previewSrc)
      }
    }
  }, [previewSrc])

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    event.target.value = ''

    if (!file) {
      return
    }

    setPreviewSrc(URL.createObjectURL(file))

    if (!onUpload) {
      return
    }

    setIsUploading(true)

    try {
      await onUpload(file)
    } catch {
      setPreviewSrc(initialSrc)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='group relative'>
      <Tooltip content='Alterar imagem'>
        <button
          type='button'
          aria-label='Alterar foto'
          aria-busy={isUploading}
          disabled={isUploading}
          className={`relative cursor-pointer overflow-hidden rounded-full bg-surface-container-highest disabled:cursor-wait disabled:opacity-70 ${className ?? ''}`}
          onClick={() => inputRef.current?.click()}
          style={{ height: size, width: size }}
        >
          <Image
            src={previewSrc}
            alt={alt}
            fill
            className='object-cover'
            sizes={`${size}px`}
            unoptimized
            onError={() => setPreviewSrc('/images/pfp.webp')}
          />
          <span className='absolute inset-0 flex items-center justify-center bg-foreground/0 text-foreground-inverse opacity-0 transition-all duration-200 group-hover:bg-foreground/30 group-hover:opacity-100'>
            <IconPhoto className='size-4' stroke={2} />
          </span>
        </button>
      </Tooltip>

      <input
        ref={inputRef}
        type='file'
        accept={imageUploadAcceptAttribute}
        className='sr-only'
        disabled={isUploading}
        onChange={handleFileChange}
      />
    </div>
  )
}
