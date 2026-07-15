import { FastifyInstance } from "fastify";
import z from "zod";
import { getMe, changeAvatar } from "@/controllers/profile.controller.js";
import { authenticate } from "@/middlewares/authenticate.js";

export const profileRoutes = async (app: FastifyInstance) => {
  app.get(
    "/me",
    {
      schema: {
        tags: ["Profile"],
        summary: "Obtém o perfil do administrador",
        description: "Retorna os dados do administrador autenticado.",
        response: {
          200: z
            .object({
              id: z.number().int().describe("Identificador do administrador"),
              email: z.email().describe("Email do administrador"),
              image: z.string().nullable().describe("URL da imagem de perfil"),
            })
            .describe("Perfil do administrador obtido com sucesso"),
          404: z
            .object({
              error: z
                .string()
                .describe(
                  "Mensagem indicando que o administrador não foi encontrado",
                ),
            })
            .describe("Administrador não encontrado"),
        },
      },
      preHandler: authenticate,
    },
    getMe,
  );

  app.patch(
    "/me/avatar",
    {
      schema: {
        tags: ["Profile"],
        summary: "Atualiza o avatar do administrador",
        description: "Envia uma nova imagem de perfil.",
        consumes: ["multipart/form-data"],
        body: z.object({
          avatar: z
            .unknown()
            .describe(
              "Arquivo de imagem. Formatos aceitos: JPEG, PNG, WebP, HEIC e HEIF",
            ),
        }),
        response: {
          200: z
            .object({
              image: z
                .string()
                .nullable()
                .describe("URL da imagem do condomínio"),
            })
            .describe("Avatar atualizado com sucesso"),
          400: z
            .object({
              error: z
                .string()
                .describe(
                  "Mensagem descrevendo o erro relacionado ao upload da imagem",
                ),
            })
            .describe("Requisição inválida"),
        },
      },
      preHandler: authenticate,
    },
    changeAvatar,
  );
};
