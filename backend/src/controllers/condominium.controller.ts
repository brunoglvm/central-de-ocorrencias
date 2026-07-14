import { prisma } from "@/lib/prisma.js";
import { FastifyReply, FastifyRequest } from "fastify";

export const getCondominiumImage = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const admin = await prisma.admin.findUnique({
    where: { id: 1 },
    select: {
      image: true,
    },
  });

  if (!admin)
    return reply.code(404).send({ error: "Administrador não encontrado" });

  return reply.send(admin);
};
