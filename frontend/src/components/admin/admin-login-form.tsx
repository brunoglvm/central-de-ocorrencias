'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { login } from '@/services/api/auth'
import { setAuthToken } from '@/services/api/client'

type AdminLoginFormProps = {
  condominiumImage?: string | null
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AdminLoginForm({ condominiumImage }: AdminLoginFormProps) {
  const router = useRouter()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [imageSrc, setImageSrc] = useState(condominiumImage || '/images/pfp.webp')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
      toast.error('Informe e-mail e senha.')
      return
    }

    if (!emailPattern.test(email)) {
      toast.error('Informe um e-mail válido.')
      return
    }

    setIsSubmitting(true)

    try {
      const { token } = await login({ email, password })

      setAuthToken(token)
      router.replace('/admin/quadro')
      router.refresh()
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, 'E-mail ou senha inválidos.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='w-full max-w-md rounded-[2.25rem] p-6 shadow-none sm:p-8'>
      <form className='space-y-6' noValidate onSubmit={handleSubmit} suppressHydrationWarning>
        <div className='flex justify-center'>
          <div className='relative size-24 overflow-hidden rounded-full bg-surface-container-highest'>
            <Image
              src={imageSrc}
              alt='Condomínio'
              fill
              className='object-cover'
              sizes='6rem'
              priority
              unoptimized
              onError={() => setImageSrc('/images/pfp.webp')}
            />
          </div>
        </div>

        <Input
          id='admin-email'
          label='E-mail'
          name='email'
          type='email'
          placeholder='admin@condominio.com.br'
          autoComplete='email'
          required
        />

        <Input
          id='admin-password'
          label='Senha'
          name='password'
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder='Digite sua senha'
          autoComplete='current-password'
          required
          endAdornment={
            <button
              type='button'
              aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={isPasswordVisible}
              className='flex size-5 cursor-pointer items-center justify-center text-foreground-muted transition-colors hover:text-foreground'
              onClick={() => setIsPasswordVisible((current) => !current)}
            >
              {isPasswordVisible ? (
                <IconEyeOff className='size-5' stroke={1.8} />
              ) : (
                <IconEye className='size-5' stroke={1.8} />
              )}
            </button>
          }
        />

        <div className='flex'>
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
