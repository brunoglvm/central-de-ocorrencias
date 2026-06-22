import { FastifyInstance } from "fastify";
import { getMe, changeAvatar } from "@/controllers/profile.controller.js";
import { authenticate } from "@/middlewares/authenticate.js";

export const profileRoutes = async (app: FastifyInstance) => {
  app.get("/me", { preHandler: authenticate }, getMe);
  app.patch("/me/avatar", { preHandler: authenticate }, changeAvatar);
};
