import { z } from "zod/v4";
import {
  OccurrenceSource,
  OccurrenceStatus,
} from "../../prisma/src/generated/prisma/enums.js";

export const occurrenceParamsSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
    .describe("Identificador da ocorrência"),
});

export const occurrenceBodySchema = z.object({
  title: z
    .string("O título deve ser um texto")
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  description: z
    .string("O título deve ser um texto")
    .min(5, "A descrição deve ter pelo menos 5 caracteres")
    .max(800, "A descrição deve ter no máximo 800 caracteres"),
  location: z
    .string("O título deve ser um texto")
    .min(2, "A localização deve ter pelo menos 2 caracteres")
    .max(200, "A localização deve ter no máximo 200 caracteres"),
  source: z.enum(OccurrenceSource, "A origem da ocorrência é inválida"),
});

export const occurrenceResponseSchema = z.object({
  id: z.number().int().describe("Identificador da ocorrência"),
  title: z.string().describe("Título da ocorrência"),
  description: z.string().describe("Descrição da ocorrência"),
  location: z.string().describe("Local da ocorrência"),
  image: z.string().nullable().describe("URL da imagem da ocorrência"),
  archived: z.boolean().describe("Indica se a ocorrência está arquivada"),
  status: z.enum(OccurrenceStatus).describe("Status atual da ocorrência"),
  source: z.enum(OccurrenceSource).describe("Origem da ocorrência"),
  createdAt: z.date().describe("Data de criação da ocorrência"),
});
