'use client'

import { useState } from 'react'
import Image from 'next/image'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AdminLoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <Card className="w-full max-w-md rounded-[2.25rem] p-6 shadow-none sm:p-8">
      <form className="space-y-6">
        <div className="flex justify-center">
          <div className="relative size-24 overflow-hidden rounded-full bg-surface-container-highest">
            <Image src="/images/pfp.webp" alt="Condomínio" fill className="object-cover" sizes="96px" priority />
          </div>
        </div>

        <Input
          id="admin-email"
          label="E-mail"
          name="email"
          type="email"
          placeholder="admin@condominio.com.br"
          required
        />

        <Input
          id="admin-password"
          label="Senha"
          name="password"
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="Digite sua senha"
          required
          endAdornment={
            <button
              type="button"
              aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={isPasswordVisible}
              className="flex size-5 cursor-pointer items-center justify-center text-foreground-muted transition-colors hover:text-foreground"
              onClick={() => setIsPasswordVisible((current) => !current)}
            >
              {isPasswordVisible ? (
                <IconEyeOff className="size-5" stroke={1.8} />
              ) : (
                <IconEye className="size-5" stroke={1.8} />
              )}
            </button>
          }
        />

        <div className="flex">
          <Button href="/admin/quadro" className="w-full">
            Entrar
          </Button>
        </div>
      </form>
    </Card>
  )
}
