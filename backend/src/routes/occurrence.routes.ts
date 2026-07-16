import { z } from "zod/v4";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authenticate } from "@/middlewares/authenticate.js";
import {
  createOccurrence,
  getOccurrences,
  getOccurrence,
  updateOccurrenceStatus,
  updateOccurrenceArchive,
  deleteOccurrence,
} from "@/controllers/occurrence.controller.js";
import { bearerAuthHeaderSchema } from "@/schemas/auth.schema.js";
import {
  occurrenceParamsSchema,
  occurrenceResponseSchema,
} from "@/schemas/occurrence.schema.js";
import {
  OccurrenceSource,
  OccurrenceStatus,
} from "../../prisma/src/generated/prisma/enums.js";

export const occurrenceRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/public/occurrences",
    {
      schema: {
        tags: ["Occurrences"],
        summary: "Cria uma ocorrência",
        description:
          "Registra uma nova ocorrência informando título, descrição, localização, origem e uma imagem opcional.",
        consumes: ["multipart/form-data"],
        body: z.object({
          title: z.string().describe("Título da ocorrência"),
          description: z.string().describe("Descrição detalhada da ocorrência"),
          location: z.string().describe("Local onde a ocorrência aconteceu"),
          source: z
            .enum(OccurrenceSource)
            .describe(
              "Origem da ocorrência: RESIDENT para moradores e EMPLOYEE para funcionários",
            ),
          occurrence: z
            .unknown()
            .optional()
            .describe(
              "Arquivo de imagem opcional da ocorrência. Formatos aceitos: JPEG, PNG, WebP, HEIC e HEIF",
            ),
        }),
        response: {
          201: occurrenceResponseSchema.describe(
            "Ocorrência criada com sucesso",
          ),
          400: z
            .object({
              error: z
                .string()
                .describe(
                  "Mensagem descrevendo o erro relacionado aos dados enviados ou arquivo",
                ),
            })
            .describe("Requisição inválida"),
        },
      },
    },
    createOccurrence,
  );

  app.get(
    "/occurrences",
    {
      schema: {
        tags: ["Occurrences"],
        summary: "Lista todas as ocorrências",
        description:
          "Retorna uma lista de ocorrências cadastradas no sistema, incluindo informações como título, descrição, localização, origem, status e data de criação.",
        headers: bearerAuthHeaderSchema,
        response: {
          200: z
            .array(occurrenceResponseSchema)
            .describe("Ocorrências encontradas com sucesso"),
        },
      },
      preHandler: authenticate,
    },
    getOccurrences,
  );

  app.get(
    "/occurrences/:id",
    {
      schema: {
        tags: ["Occurrences"],
        summary: "Busca uma ocorrência pelo ID",
        description:
          "Retorna uma ocorrência específica cadastrada no sistema pelo seu identificador.",
        params: occurrenceParamsSchema,
        headers: bearerAuthHeaderSchema,
        response: {
          200: occurrenceResponseSchema.describe(
            "Ocorrência encontrada com sucesso",
          ),
          404: z
            .object({
              error: z
                .string()
                .describe(
                  "Mensagem informando que a ocorrência solicitada não foi encontrada",
                ),
            })
            .describe("Recurso não encontrado"),
        },
      },
    },
    getOccurrence,
  );

  app.patch(
    "/occurrences/:id/status",
    {
      preHandler: authenticate,
      schema: {
        tags: ["Occurrences"],
        summary: "Atualiza o status de uma ocorrência",
        description:
          "Atualiza o status de uma ocorrência cadastrada no sistema por meio do seu identificador.",
        params: occurrenceParamsSchema,
        headers: bearerAuthHeaderSchema,
        body: z.object({
          status: z
            .enum(OccurrenceStatus)
            .describe("Novo status da ocorrência"),
        }),
        response: {
          200: z
            .object({
              id: z.number().int().describe("Identificador da ocorrência"),
              status: z
                .enum(OccurrenceStatus)
                .describe("Status atualizado da ocorrência"),
            })
            .describe("Status da ocorrência atualizado com sucesso"),
        },
      },
    },
    updateOccurrenceStatus,
  );

  app.patch(
    "/occurrences/:id/archive",
    {
      preHandler: authenticate,
      schema: {
        tags: ["Occurrences"],
        summary: "Atualiza o arquivamento de uma ocorrência",
        description:
          "Atualiza o estado de arquivamento de uma ocorrência cadastrada no sistema por meio do seu identificador.",
        params: occurrenceParamsSchema,
        headers: bearerAuthHeaderSchema,
        body: z.object({
          archived: z
            .boolean()
            .describe("Indica se a ocorrência deve ser arquivada"),
        }),
        response: {
          200: z
            .object({
              id: z.number().int().describe("Identificador da ocorrência"),
              archived: z
                .boolean()
                .describe("Indica se a ocorrência está arquivada"),
            })
            .describe("Arquivamento da ocorrência atualizado com sucesso"),
        },
      },
    },
    updateOccurrenceArchive,
  );

  app.delete(
    "/occurrences/:id",
    {
      preHandler: authenticate,
      schema: {
        tags: ["Occurrences"],
        summary: "Remove uma ocorrência",
        description:
          "Remove uma ocorrência cadastrada no sistema por meio do seu identificador.",
        params: occurrenceParamsSchema,
        headers: bearerAuthHeaderSchema,
        response: {
          204: z.null().describe("Ocorrência removida com sucesso"),
        },
      },
    },
    deleteOccurrence,
  );
};
