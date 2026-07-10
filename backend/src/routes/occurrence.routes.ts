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
import { OccurrenceStatus } from "../../prisma/src/generated/prisma/enums.js";

export const occurrenceRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post("/public/occurrences", createOccurrence);

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
