'use client'

import { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { IconEye } from '@tabler/icons-react'
import { ImagePreviewModal } from '@/components/ui/image-preview-modal'
import { Tooltip } from '@/components/ui/tooltip'
import { imageUploadAccept, imageUploadTypeErrorMessage, occurrenceImageMaxSize } from '@/constants/image-upload'
import { cn } from '@/lib/utils'

type AttachmentDropzoneProps = {
  className?: string
  error?: string
  file: File | null
  onFileSelect: (file: File | null) => void
}

export function AttachmentDropzone({ className, error, file, onFileSelect }: AttachmentDropzoneProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  const fileName = file?.name ?? ''
  const displayedError = fileError ?? error

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: imageUploadAccept,
    maxFiles: 1,
    maxSize: occurrenceImageMaxSize,
    onDrop: (acceptedFiles, rejections) => {
      setIsPreviewOpen(false)

      if (acceptedFiles.length > 0) {
        setFileError(null)
        onFileSelect(acceptedFiles[0])
      }

      if (rejections.length === 0) {
        return
      }

      const rejectionCodes = new Set(rejections[0].errors.map((rejection) => rejection.code))

      if (rejectionCodes.has('file-too-large')) {
        setFileError('A imagem deve ter no máximo 5 MB.')
      } else if (rejectionCodes.has('file-invalid-type')) {
        setFileError(imageUploadTypeErrorMessage)
      } else if (rejectionCodes.has('too-many-files')) {
        setFileError('Envie apenas uma imagem.')
      } else {
        setFileError('Não foi possível usar este arquivo.')
      }
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
            displayedError && 'ring-2 ring-danger-strong/18',
          )}
        >
          <input {...getInputProps()} />

          <div className='grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 overflow-hidden'>
            <p className='min-w-0 truncate text-sm'>
              {fileName ? fileName : isDragActive ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem'}
            </p>

            {fileName && previewUrl ? (
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
            ) : null}
          </div>
        </div>
      </div>

      {displayedError ? <p className='text-sm text-danger-strong'>{displayedError}</p> : null}

      <ImagePreviewModal
        fileName={fileName || 'Imagem anexada'}
        imageUrl={previewUrl ?? ''}
        isOpen={isPreviewOpen && Boolean(previewUrl)}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}
