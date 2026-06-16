import { FastifyInstance } from "fastify";
import { getMe, changeAvatar } from "@/controllers/profile.controller.js";

export const profileRoutes = async (app: FastifyInstance) => {
  app.get("/me", getMe);
  app.patch("/me/avatar", changeAvatar);
};
