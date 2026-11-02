import { z } from 'zod'

export const CUSTOM_LOCATION_VALUE = '__custom_location__'

export const registerOccurrenceSchema = z
  .object({
    customLocation: z.string().trim().max(200, 'Informe o local do problema com no máximo 200 caracteres.'),
    description: z
      .string()
      .trim()
      .min(10, 'Descreva o problema com pelo menos 10 caracteres.')
      .max(800, 'Descreva o problema com no máximo 800 caracteres.'),
    location: z
      .string()
      .min(1, 'Selecione o local do problema.')
      .max(200, 'Selecione um local com no máximo 200 caracteres.'),
    title: z
      .string()
      .trim()
      .min(3, 'Informe um título com pelo menos 3 caracteres.')
      .max(100, 'Informe um título com no máximo 100 caracteres.'),
    source: z.string().refine((value) => ['RESIDENT', 'EMPLOYEE'].includes(value), 'Selecione quem está registrando.'),
  })
  .superRefine((values, context) => {
    if (values.location === CUSTOM_LOCATION_VALUE && values.customLocation.length < 3) {
      context.addIssue({
        code: 'custom',
        message: 'Informe o local do problema com pelo menos 3 caracteres.',
        path: ['customLocation'],
      })
    }
  })

export type RegisterOccurrenceFormValues = z.infer<typeof registerOccurrenceSchema>
