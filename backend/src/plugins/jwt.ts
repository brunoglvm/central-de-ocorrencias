import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "secret",
  });
});
