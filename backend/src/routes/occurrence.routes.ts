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
          201: z
            .object({
              id: z.number().int().describe("Identificador da ocorrência"),
              title: z.string().describe("Título da ocorrência"),
              description: z.string().describe("Descrição da ocorrência"),
              location: z.string().describe("Local da ocorrência"),
              image: z
                .string()
                .nullable()
                .describe("URL da imagem da ocorrência"),
              archived: z
                .boolean()
                .describe("Indica se a ocorrência está arquivada"),
              status: z
                .enum(OccurrenceStatus)
                .describe("Status atual da ocorrência"),
              source: z.enum(OccurrenceSource).describe("Origem da ocorrência"),
              createdAt: z.date().describe("Data de criação da ocorrência"),
            })
            .describe("Ocorrência criada com sucesso"),

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

  app.get("/occurrences", { preHandler: authenticate }, getOccurrences);

  app.get(
    "/occurrences/:id",
    {
      preHandler: authenticate,
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
      },
    },
    getOccurrence,
  );

  app.patch(
    "/occurrences/:id/status",
    {
      preHandler: authenticate,
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        body: z.object({
          status: z.enum(OccurrenceStatus),
        }),
      },
    },
    updateOccurrenceStatus,
  );

  app.patch(
    "/occurrences/:id/archive",
    {
      preHandler: authenticate,
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        body: z.object({
          archived: z.boolean(),
        }),
      },
    },
    updateOccurrenceArchive,
  );

  app.delete(
    "/occurrences/:id",
    {
      preHandler: authenticate,
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
      },
    },
    deleteOccurrence,
  );
};
