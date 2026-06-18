import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma.js";

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = request.user.id;

  const me = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      image: true,
    },
  });

  if (!me) return reply.code(404).send({ error: "Usuário não encontrado" });

  return reply.send(me);
};

export const changeAvatar = async () => {};
