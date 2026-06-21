import { prisma } from "@/lib/prisma.js";
import { FastifyReply } from "fastify";

export const getCondominiumImage = async (reply: FastifyReply) => {
  const admin = await prisma.admin.findUnique({
    where: { id: 1 },
    select: {
      image: true,
    },
  });

  return reply.send(admin);
};
