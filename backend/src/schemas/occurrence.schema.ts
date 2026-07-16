import { z } from "zod/v4";
import {
  OccurrenceSource,
  OccurrenceStatus,
} from "../../prisma/src/generated/prisma/enums.js";

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
