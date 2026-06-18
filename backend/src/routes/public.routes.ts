import { FastifyInstance } from "fastify";
import { getCondominiumImage } from "@/controllers/public.controller.js";

export const condominiumRoutes = async (app: FastifyInstance) => {
  app.get("/public/condominium", getCondominiumImage);
};
