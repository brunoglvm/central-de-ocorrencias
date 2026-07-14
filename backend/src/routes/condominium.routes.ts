import { FastifyInstance } from "fastify";
import z from "zod";
import { getCondominiumImage } from "@/controllers/condominium.controller.js";

export const condominiumRoutes = async (app: FastifyInstance) => {
  app.get(
    "/public/condominium",
    {
      schema: {
        tags: ["Condominium"],
        summary: "Obtém a imagem do condomínio",
        description: "Retorna a imagem de identificação do condomínio.",
        response: {
          200: z.object({
            image: z
              .string()
              .nullable()
              .describe("URL da imagem do condomínio"),
          }),
          404: z.object({
            error: z
              .string()
              .describe(
                "Mensagem indicando que o administrador não foi encontrado",
              ),
          }),
        },
      },
    },
    getCondominiumImage,
  );
};
