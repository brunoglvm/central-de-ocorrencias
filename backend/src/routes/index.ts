import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.js";
import { profileRoutes } from "./profile.routes.js";
import { condominiumRoutes } from "./condominium.routes.js";
import { occurrenceRoutes } from "./occurrence.routes.js";

export const routes = async (app: FastifyInstance) => {
  app.register(authRoutes);
  app.register(profileRoutes);
  app.register(condominiumRoutes);
  app.register(occurrenceRoutes);
};
