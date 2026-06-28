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

  return reply.send(admin);
};
