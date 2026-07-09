import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma.js";

export const getOccurrences = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const occurrences = await prisma.occurrence.findMany();

  return reply.send(occurrences);
};

export const getOccurrence = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const occurrence = await prisma.occurrence.findUnique({
    where: { id },
    omit: {
      createdAt: false,
    },
  });

  if (!occurrence)
    return reply.code(404).send({ error: "Ocorrencia não encontrada" });

  return reply.send(occurrence);
};

export const deleteOccurrence = async (
  request: FastifyRequest<{
    Params: {
      id: number;
    };
  }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const occurrence = await prisma.occurrence.findUnique({
    where: { id },
    omit: {
      createdAt: true,
    },
  });

  if (!occurrence)
    return reply.code(404).send({ error: "Ocorrencia não encontrada" });

  await prisma.occurrence.delete({
    where: { id },
  });

  return reply.code(204).send();
};

export const createOccurrence = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {};
