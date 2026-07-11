import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma.js";
import { OccurrenceStatus } from "../../prisma/src/generated/prisma/client.js";

export const createOccurrence = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { title, description, image, location, source } = request.body;
};

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
      createdAt: true,
    },
  });

  if (!occurrence)
    return reply.code(404).send({ error: "Ocorrencia não encontrada" });

  return reply.send(occurrence);
};

export const updateOccurrenceStatus = async (
  request: FastifyRequest<{
    Params: {
      id: number;
    };
    Body: {
      status: OccurrenceStatus;
    };
  }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const { status } = request.body;

  const occurrence = await prisma.occurrence.update({
    where: { id },
    data: {
      status,
    },
    select: {
      id: true,
      status: true,
    },
  });

  return reply.send(occurrence);
};

export const updateOccurrenceArchive = async (
  request: FastifyRequest<{
    Params: {
      id: number;
    };
    Body: {
      archived: boolean;
    };
  }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const { archived } = request.body;

  const occurrence = await prisma.occurrence.update({
    where: { id },
    data: {
      archived,
    },
    select: {
      id: true,
      archived: true,
    },
  });

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

  await prisma.occurrence.delete({
    where: { id },
  });
  return reply.code(204).send();
};
