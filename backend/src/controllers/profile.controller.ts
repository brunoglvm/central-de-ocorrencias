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

export const changeAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.user;
  const { image } = request.body;

  if (!image) {
    return reply.code(400).send({ error: "Imagem é obrigatória" });
  }

  const avatar = await prisma.admin.update({
    where: { id },
    data: {
      image,
    },
    select: {
      image: true,
    },
  });

  return reply.send(avatar);
};
