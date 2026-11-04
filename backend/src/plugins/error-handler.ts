import { FastifyError, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { Prisma } from '../../prisma/src/generated/prisma/client.js'

const clientErrorMessages: Record<number, string> = {
  400: 'Dados inválidos',
  401: 'Não autorizado',
  403: 'Acesso negado',
  404: 'Conteúdo não encontrado',
  409: 'Conflito com dados existentes',
  413: 'O arquivo enviado excede o tamanho máximo permitido',
  415: 'Formato de conteúdo não suportado',
  429: 'Muitas tentativas. Aguarde um minuto e tente novamente',
}

const errorHandlerPlugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        error: error.validation[0]?.message ?? 'Dados inválidos',
      })
    }

    const fastifyError = error as FastifyError

    if (fastifyError instanceof Prisma.PrismaClientKnownRequestError && fastifyError.code === 'P2025') {
      return reply.status(404).send({
        error: 'Conteúdo não encontrado',
      })
    }

    if (fastifyError instanceof Prisma.PrismaClientKnownRequestError && fastifyError.code === 'P2002') {
      return reply.status(409).send({
        error: 'Conflito com dados existentes',
      })
    }

    if (fastifyError instanceof Prisma.PrismaClientKnownRequestError && fastifyError.code === 'P2003') {
      return reply.status(400).send({
        error: 'Dados inválidos: referência inexistente',
      })
    }

    if (fastifyError.code === 'FST_REQ_FILE_TOO_LARGE') {
      return reply.status(413).send({
        error: 'O arquivo enviado excede o tamanho máximo permitido',
      })
    }

    const statusCode = (fastifyError as FastifyError).statusCode ?? 500

    if (statusCode >= 500) {
      request.log.error(fastifyError)

      return reply.status(500).send({
        error: 'Erro interno. Tente novamente em instantes',
      })
    }

    return reply.status(statusCode).send({
      error: clientErrorMessages[statusCode] ?? 'Não foi possível concluir a requisição',
    })
  })
}

export default fp(errorHandlerPlugin)
