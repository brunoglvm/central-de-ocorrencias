import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma.js";
import { validateLogin } from "@/lib/bcrypt.js";

type LoginBody = {
  email: string;
  password: string;
};

export const login = async (
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply
      .code(401)
      .send({ error: "Campos obrigatórios não preenchidos" });
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) return reply.code(401).send({ error: "Credenciais inválidas" });

  const isValid = await validateLogin(admin, password);

  if (!isValid) return reply.code(401).send({ error: "Credenciais inválidas" });

  return reply.send(admin);
};
