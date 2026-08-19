'use client'

import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { IconEye } from '@tabler/icons-react'
import { ImagePreviewModal } from '@/components/ui/image-preview-modal'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type AttachmentDropzoneProps = {
  className?: string
  error?: string
  fileName: string
  onFileSelect: (fileName: string) => void
}

export function AttachmentDropzone({ className, error, fileName, onFileSelect }: AttachmentDropzoneProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    if (fileName) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsPreviewOpen(false)
      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current)
        }

        return null
      })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [fileName])

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const nextFile = acceptedFiles[0]

      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current)
        }

        if (nextFile?.type.startsWith('image/')) {
          return URL.createObjectURL(nextFile)
        }

        return null
      })

      onFileSelect(nextFile?.name ?? '')
    },
  })

  return (
    <div className={cn('space-y-2', className)}>
      <span className='text-sm text-foreground-muted'>Anexo</span>

      <div className='relative'>
        <div
          {...getRootProps()}
          className={cn(
            'flex min-h-12 w-full cursor-pointer items-center justify-between rounded-2xl bg-surface-container-lowest px-4 py-3 text-left text-sm transition-colors',
            isDragActive && 'bg-surface-container-highest',
            error && 'ring-2 ring-danger-strong/18',
          )}
        >
          <input {...getInputProps()} />

          <div className='grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 overflow-hidden'>
            <p className='min-w-0 truncate text-sm'>
              {fileName ? fileName : isDragActive ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem'}
            </p>

            {fileName ? (
              previewUrl ? (
                <Tooltip content='Ver imagem'>
                  <button
                    type='button'
                    aria-label='Visualizar imagem anexada'
                    className='group flex size-5 shrink-0 cursor-pointer items-center justify-center'
                    onClick={(event) => {
                      event.stopPropagation()
                      setIsPreviewOpen(true)
                    }}
                  >
                    <IconEye
                      className='size-5 text-foreground-muted transition-colors group-hover:text-foreground'
                      stroke={1.8}
                    />
                  </button>
                </Tooltip>
              ) : null
            ) : null}
          </div>
        </div>
      </div>

      {error ? <p className='text-sm text-danger-strong'>{error}</p> : null}

      <ImagePreviewModal
        fileName={fileName || 'Imagem anexada'}
        imageUrl={previewUrl ?? ''}
        isOpen={isPreviewOpen && Boolean(previewUrl)}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}
