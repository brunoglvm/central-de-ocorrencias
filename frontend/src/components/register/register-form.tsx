'use client'

import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AttachmentDropzone } from '@/components/register/attachment-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, type SelectOption } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { occurrenceLocations } from '@/constants/occurrences'
import { getErrorMessage } from '@/lib/errors'
import {
  CUSTOM_LOCATION_VALUE,
  type RegisterOccurrenceFormValues,
  registerOccurrenceSchema,
} from '@/lib/validations/register-occurrence'
import { createOccurrence } from '@/services/api/occurrences'

const locationOptions: SelectOption[] = [
  ...occurrenceLocations.map((location) => ({
    label: location,
    value: location,
  })),
  {
    label: 'Outro local',
    value: CUSTOM_LOCATION_VALUE,
  },
]

const sourceOptions: SelectOption[] = [
  { label: 'Morador', value: 'RESIDENT' },
  { label: 'Funcionário', value: 'EMPLOYEE' },
]

const initialForm: RegisterOccurrenceFormValues = {
  customLocation: '',
  description: '',
  location: '',
  title: '',
  source: '',
}

export function RegisterForm() {
  const [attachment, setAttachment] = useState<File | null>(null)
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<RegisterOccurrenceFormValues>({
    defaultValues: initialForm,
    resolver: zodResolver(registerOccurrenceSchema),
  })
  const selectedLocation = useWatch({ control, name: 'location' })
  const shouldShowCustomLocation = selectedLocation === CUSTOM_LOCATION_VALUE

  async function onSubmit(values: RegisterOccurrenceFormValues) {
    const resolvedLocation = values.location === CUSTOM_LOCATION_VALUE ? values.customLocation.trim() : values.location

    if (values.source !== 'RESIDENT' && values.source !== 'EMPLOYEE') {
      return
    }

    try {
      await createOccurrence({
        title: values.title.trim(),
        description: values.description.trim(),
        location: resolvedLocation,
        source: values.source,
        image: attachment,
      })

      toast.success(`Ocorrência "${values.title.trim()}" registrada com sucesso.`)
      reset(initialForm)
      setAttachment(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível registrar a ocorrência.'))
    }
  }

  return (
    <Card className='w-full rounded-[2.25rem] p-6 shadow-none sm:p-8'>
      <form className='space-y-6' noValidate onSubmit={handleSubmit(onSubmit)} suppressHydrationWarning>
        <div className='grid gap-6 lg:grid-cols-12'>
          <div className='lg:col-span-6'>
            <Input
              className='min-h-12'
              error={errors.title?.message}
              label='Título'
              placeholder='Ex.: Vazamento no bloco B'
              {...register('title')}
              required
            />
          </div>

          <div className='lg:col-span-6'>
            <Controller
              control={control}
              name='location'
              render={({ field }) => (
                <Select
                  className='min-h-12'
                  error={errors.location?.message}
                  label='Local do problema'
                  onBlur={field.onBlur}
                  onValueChange={(value) => {
                    field.onChange(value)
                    if (value !== CUSTOM_LOCATION_VALUE) {
                      setValue('customLocation', '')
                    }
                  }}
                  options={locationOptions}
                  value={field.value}
                />
              )}
            />
          </div>
        </div>

        {shouldShowCustomLocation ? (
          <Input
            className='min-h-12'
            error={errors.customLocation?.message}
            label='Qual é o local do problema?'
            placeholder='Ex.: Escadaria lateral do bloco C'
            {...register('customLocation')}
            required
          />
        ) : null}

        <Textarea
          className='min-h-44'
          error={errors.description?.message}
          label='Descrição'
          placeholder='Descreva o contexto, local exato e impacto percebido.'
          {...register('description')}
          required
        />

        <div className='grid gap-6 lg:grid-cols-12 lg:items-start'>
          <div className='lg:col-span-6'>
            <Controller
              control={control}
              name='source'
              render={({ field }) => (
                <Select
                  className='min-h-12'
                  error={errors.source?.message}
                  label='Quem está registrando?'
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  options={sourceOptions}
                  placeholder='Selecione'
                  value={field.value}
                />
              )}
            />
          </div>

          <AttachmentDropzone
            className='lg:col-span-6'
            file={attachment}
            onFileSelect={setAttachment}
            error={errors.root?.message}
          />
        </div>

        <div className='flex justify-center'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar ocorrência'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
