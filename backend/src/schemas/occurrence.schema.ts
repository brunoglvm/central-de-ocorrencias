import { z } from 'zod/v4'
import { OccurrenceSource, OccurrenceStatus } from '../../prisma/src/generated/prisma/enums.js'

export const occurrenceParamsSchema = z.object({
  id: z.coerce
    .number('O identificador deve ser um número')
    .int('O identificador deve ser um número inteiro')
    .positive('O identificador deve ser maior que zero')
    .describe('Identificador da ocorrência'),
})

export const occurrenceBodySchema = z.object({
  title: z
    .string('O título deve ser um texto')
    .trim()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z
    .string('A descrição deve ser um texto')
    .trim()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(800, 'A descrição deve ter no máximo 800 caracteres'),
  location: z
    .string('A localização deve ser um texto')
    .trim()
    .min(2, 'A localização deve ter pelo menos 2 caracteres')
    .max(200, 'A localização deve ter no máximo 200 caracteres'),
  source: z.enum(OccurrenceSource, 'A origem da ocorrência é inválida'),
})

export const occurrenceResponseSchema = z.object({
  id: z.number().int().describe('Identificador da ocorrência'),
  title: z.string().describe('Título da ocorrência'),
  description: z.string().describe('Descrição da ocorrência'),
  location: z.string().describe('Local da ocorrência'),
  image: z.string().nullable().describe('URL da imagem da ocorrência'),
  archived: z.boolean().describe('Indica se a ocorrência está arquivada'),
  status: z.enum(OccurrenceStatus).describe('Status atual da ocorrência'),
  source: z.enum(OccurrenceSource).describe('Origem da ocorrência'),
  createdAt: z.date().describe('Data de criação da ocorrência'),
})
