import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className='flex min-h-screen flex-col'>{children}</div>
}
