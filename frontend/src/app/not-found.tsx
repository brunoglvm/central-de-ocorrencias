import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className='mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-5xl flex-col items-center justify-center gap-8'>
      <Image
        src='/images/page-not-found.webp'
        alt='Ilustração de erro 404 com uma pessoa segurando uma placa escrito not found'
        width={780}
        height={620}
        priority
        className='h-auto w-full max-w-105 sm:max-w-130'
      />

      <Button href='/registrar'>Ir para o formulário</Button>
    </section>
  )
}
