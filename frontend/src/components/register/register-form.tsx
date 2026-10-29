'use client'

import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

const userTypeOptions: SelectOption[] = [
  { label: 'Morador', value: 'RESIDENT' },
  { label: 'Funcionário', value: 'EMPLOYEE' },
]

const initialForm: RegisterOccurrenceFormValues = {
  customLocation: '',
  description: '',
  location: '',
  title: '',
  userType: '',
}

type Feedback = {
  message: string
  type: 'error' | 'success'
}

export function RegisterForm() {
  const [attachment, setAttachment] = useState<File | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
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

    if (values.userType !== 'RESIDENT' && values.userType !== 'EMPLOYEE') {
      return
    }

    setFeedback(null)

    try {
      await createOccurrence({
        title: values.title.trim(),
        description: values.description.trim(),
        location: resolvedLocation,
        source: values.userType,
        image: attachment,
      })

      setFeedback({
        message: `Ocorrência "${values.title.trim()}" registrada com sucesso.`,
        type: 'success',
      })
      reset(initialForm)
      setAttachment(null)
    } catch (error) {
      setFeedback({
        message: getErrorMessage(error, 'Não foi possível registrar a ocorrência.'),
        type: 'error',
      })
    }
  }

  return (
    <Card className='w-full rounded-[2.25rem] p-6 shadow-none sm:p-8'>
      <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
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
              name='userType'
              render={({ field }) => (
                <Select
                  className='min-h-12'
                  error={errors.userType?.message}
                  label='Quem está registrando?'
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  options={userTypeOptions}
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

        {feedback ? (
          <div
            role={feedback.type === 'error' ? 'alert' : 'status'}
            className={
              feedback.type === 'error'
                ? 'rounded-3xl bg-danger-soft px-4 py-3 text-sm leading-7 text-danger-strong'
                : 'rounded-3xl bg-surface-container-highest px-4 py-3 text-sm leading-7'
            }
          >
            {feedback.message}
          </div>
        ) : null}
      </form>
    </Card>
  )
}
