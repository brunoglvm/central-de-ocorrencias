import { prisma } from "@/lib/prisma.js";
import { FastifyReply, FastifyRequest } from "fastify";

export const getOccurrences = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const occurrences = await prisma.occurrence.findMany();

  reply.send(occurrences);
};

export const getOccurrence = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {};

export const deleteOccurrence = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {};

export const createOccurrence = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {};
