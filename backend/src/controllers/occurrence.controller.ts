import { randomUUID } from "node:crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { prisma } from "@/lib/prisma.js";
import { minioClient } from "@/lib/minio.js";
import { IMAGE_MIME_TYPES } from "@/constants/image-mime-types.js";
import {
  OccurrenceSource,
  OccurrenceStatus,
} from "../../prisma/src/generated/prisma/client.js";

export const createOccurrence = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  let title: string | undefined;
  let description: string | undefined;
  let location: string | undefined;
  let source: OccurrenceSource | undefined;

  let imageUrl: string | null = null;
  let buffer: Buffer | null = null;

  const parts = request.parts({
    limits: {
      fileSize: 5 * 1024 * 1024,
      fields: 10,
    },
  });

  for await (const part of parts) {
    if (part.type === "field") {
      switch (part.fieldname) {
        case "title":
          title = part.value as string;
          break;

        case "description":
          description = part.value as string;
          break;

        case "location":
          location = part.value as string;
          break;

        case "source":
          source = part.value as OccurrenceSource;
          break;
      }

      continue;
    }

    if (part.fieldname !== "occurrence") {
      return reply
        .code(400)
        .send({ error: "Campo inválido, esperado: occurrence" });
    }

    buffer = await part.toBuffer();
  }

  if (!title || !description || !location || !source) {
    return reply
      .code(400)
      .send({ error: "Campos obrigatórios não preenchidos" });
  }

  if (buffer) {
    const type = await fileTypeFromBuffer(buffer);

    if (!type || !IMAGE_MIME_TYPES.includes(type.mime)) {
      return reply.code(400).send({ error: "Formato não permitido" });
    }

    const bucket = process.env.MINIO_OCCURRENCES_BUCKET ?? "occurrences";
    const destinationObject = `${randomUUID()}.webp`;

    try {
      const output = await sharp(buffer)
        .rotate()
        .resize({
          width: 1920,
          height: 1920,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality: 75,
          effort: 4,
        })
        .toBuffer();

      await minioClient.putObject(
        bucket,
        destinationObject,
        output,
        output.length,
        {
          "Content-Type": "image/webp",
        },
      );

      imageUrl = `${process.env.MINIO_PUBLIC_URL}/${bucket}/${destinationObject}`;
    } catch (err) {
      console.error(err);

      return reply
        .code(400)
        .send({ error: "Arquivo inválido ou imagem corrompida" });
    }
  }

  const occurrence = await prisma.occurrence.create({
    data: {
      title,
      description,
      location,
      source,
      image: imageUrl,
    },
  });

  return reply.send(occurrence);
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
