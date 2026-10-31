'use client'

import { Toaster } from 'sonner'

export function AppToaster() {
  return <Toaster closeButton mobileOffset={16} offset={24} position='top-right' richColors />
}
