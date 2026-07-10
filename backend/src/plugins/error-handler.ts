import { FastifyPluginAsync } from "fastify";
import { Prisma } from "../../prisma/src/generated/prisma/client.js";

const errorHandlerPlugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error, _request, reply) => {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return reply.status(404).send({
        error: "Conteúdo não encontrado",
      });
    }

    throw error;
  });
};

export default errorHandlerPlugin;
