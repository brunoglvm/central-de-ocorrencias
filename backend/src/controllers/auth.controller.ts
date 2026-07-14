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
  const { email: loginEmail, password } = request.body;

  const admin = await prisma.admin.findUnique({
    where: { email: loginEmail },
  });

  if (!admin) return reply.code(401).send({ error: "Credenciais inválidas" });

  const { id, email, image } = admin;

  const isValid = await validateLogin(admin, password);

  if (!isValid) return reply.code(401).send({ error: "Credenciais inválidas" });

  const token = await reply.jwtSign(
    { id },
    {
      expiresIn: "7d",
    },
  );

  return reply.send({
    token,
    user: {
      id,
      email,
      image,
    },
  });
};
