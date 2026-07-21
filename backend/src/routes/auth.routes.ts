import { FastifyInstance } from "fastify";
import z from "zod";
import { login } from "@/controllers/auth.controller.js";
import { disableRateLimit } from "@/tests/performance/config.js";

export const authRoutes = async (app: FastifyInstance) => {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Realiza login do administrador",
        description:
          "Autentica um administrador através de email e senha e retorna um token JWT.",
        body: z.object({
          email: z.email().describe("Email do administrador"),
          password: z.string().min(1).describe("Senha do administrador"),
        }),
        response: {
          200: z
            .object({
              token: z.string().describe("Token JWT para autenticação"),
              user: z.object({
                id: z.number().describe("Identificador do administrador"),
                email: z.string().describe("Email do administrador"),
                image: z
                  .string()
                  .nullable()
                  .describe("URL da imagem de perfil"),
              }),
            })
            .describe("Login realizado com sucesso"),

          401: z
            .object({
              error: z
                .string()
                .describe(
                  "Mensagem indicando que as credenciais são inválidas",
                ),
            })
            .describe("Credenciais inválidas"),
        },
      },
      config: disableRateLimit
        ? {}
        : {
            rateLimit: {
              max: 5,
              timeWindow: "1 minute",
            },
          },
    },
    login,
  );
};
