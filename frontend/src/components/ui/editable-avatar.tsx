'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { IconPhoto } from '@tabler/icons-react'
import { Tooltip } from '@/components/ui/tooltip'

type EditableAvatarProps = {
  alt: string
  className?: string
  initialSrc: string
  size?: number
}

export function EditableAvatar({ alt, className, initialSrc, size = 40 }: EditableAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewSrc, setPreviewSrc] = useState(initialSrc)

  useEffect(() => {
    return () => {
      if (previewSrc.startsWith('blob:')) {
        URL.revokeObjectURL(previewSrc)
      }
    }
  }, [previewSrc])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (previewSrc.startsWith('blob:')) {
      URL.revokeObjectURL(previewSrc)
    }

    setPreviewSrc(URL.createObjectURL(file))
  }

  return (
    <div className='group relative'>
      <Tooltip content='Alterar imagem'>
        <button
          type='button'
          aria-label='Alterar foto'
          className={`relative cursor-pointer overflow-hidden rounded-full bg-surface-container-highest ${className ?? ''}`}
          onClick={() => inputRef.current?.click()}
          style={{ height: size, width: size }}
        >
          <Image src={previewSrc} alt={alt} fill className='object-cover' sizes={`${size}px`} />
          <span className='absolute inset-0 flex items-center justify-center bg-foreground/0 text-foreground-inverse opacity-0 transition-all duration-200 group-hover:bg-foreground/30 group-hover:opacity-100'>
            <IconPhoto className='size-4' stroke={2} />
          </span>
        </button>
      </Tooltip>

      <input ref={inputRef} type='file' accept='image/*' className='sr-only' onChange={handleFileChange} />
    </div>
  )
}
