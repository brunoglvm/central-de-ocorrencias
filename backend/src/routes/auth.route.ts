import { FastifyInstance } from "fastify";
import { login } from "@/controllers/auth.controller.js";

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/login", login);
};
