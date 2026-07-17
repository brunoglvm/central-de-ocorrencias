import z from "zod";

export const bearerAuthHeaderSchema = z.object({
  authorization: z
    .string({ error: "O cabeçalho Authorization é obrigatório" })
    .regex(
      /^Bearer \S+$/,
      "O cabeçalho Authorization deve estar no formato Bearer <token>",
    )
    .describe("Token de autenticação no formato: `Bearer <token>`"),
});
