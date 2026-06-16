import { FastifyInstance } from "fastify";
// import { occurrenceRoutes } from "./occurrence.route.js";
import { authRoutes } from "./auth.routes.js";
import { profileRoutes } from "./profile.routes.js";

export const routes = async (app: FastifyInstance) => {
  app.register(authRoutes);
  app.register(profileRoutes);
  // app.register(occurrenceRoutes);
};
