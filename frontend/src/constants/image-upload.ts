export const imageUploadAccept = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/heic': ['.heic'],
  'image/heif': ['.heif'],
}

export const imageUploadMimeTypes = Object.keys(imageUploadAccept)

export const imageUploadAcceptAttribute = imageUploadMimeTypes.join(',')

export const occurrenceImageMaxSize = 5 * 1024 * 1024

export const avatarImageMaxSize = 2 * 1024 * 1024

export const imageUploadTypeErrorMessage = 'Envie uma imagem JPEG, PNG, WebP, HEIC ou HEIF.'
