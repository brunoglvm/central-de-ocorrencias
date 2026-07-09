import { z } from "zod/v4";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authenticate } from "@/middlewares/authenticate.js";
import {
  getOccurrences,
  getOccurrence,
  deleteOccurrence,
  createOccurrence,
} from "@/controllers/occurrence.controller.js";

export const occurrenceRoutes: FastifyPluginAsyncZod = async (app) => {
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

  app.post("/public/occurrences", createOccurrence);
};
