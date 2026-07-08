import { FastifyInstance } from "fastify";
import {
  getOccurrences,
  getOccurrence,
  deleteOccurrence,
  createOccurrence,
} from "@/controllers/occurrence.controller.js";
import { authenticate } from "@/middlewares/authenticate.js";

export const occurrenceRoutes = async (app: FastifyInstance) => {
  app.get("/occurrences", { preHandler: authenticate }, getOccurrences);
  app.get("/occurrences/:id", { preHandler: authenticate }, getOccurrence);
  app.delete(
    "/occurrences/:id",
    { preHandler: authenticate },
    deleteOccurrence,
  );

  app.post("/public/occurrences", createOccurrence);
};
