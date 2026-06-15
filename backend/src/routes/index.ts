import { FastifyInstance } from "fastify";
// import { occurrenceRoutes } from "./occurrence.route.js";
import { authRoutes } from "./auth.route.js";

export const routes = async (app: FastifyInstance) => {
  app.register(authRoutes);
  // app.register(occurrenceRoutes);
};
