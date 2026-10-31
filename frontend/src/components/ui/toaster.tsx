'use client'

import { Toaster } from 'sonner'

const NAVBAR_HEIGHT = '4.0625rem'
const TOAST_GAP = '0.5rem'

export function AppToaster() {
  return (
    <Toaster
      closeButton
      mobileOffset={16}
      offset={`calc(${NAVBAR_HEIGHT} + ${TOAST_GAP})`}
      position='top-right'
      richColors
    />
  )
}
