import type { Metadata } from 'next'
import Image from 'next/image'
import { RegisterForm } from '@/components/register/register-form'

export const metadata: Metadata = {
  title: 'Registrar',
}

export default function RegisterPublicPage() {
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col items-center gap-10'>
      <div className='flex flex-col items-center text-center'>
        <Image src='/images/logo.png' alt='Concept Garden' width={34} height={36} className='h-8 w-auto' priority />

        <span className='mt-3 flex flex-col font-brand leading-none font-medium text-foreground-muted'>
          <span className='w-fit border-b border-foreground-muted text-base uppercase'>Concept Garden</span>
          <span className='mt-1 text-[.625rem] uppercase'>Central de Ocorrências</span>
        </span>
      </div>

      <RegisterForm />
    </div>
  )
}
