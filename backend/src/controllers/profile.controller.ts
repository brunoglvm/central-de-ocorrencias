import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma.js";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { minioClient } from "@/lib/minio.js";

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = request.user.id;

  const me = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      image: true,
    },
  });

  if (!me) return reply.code(404).send({ error: "Usuário não encontrado" });

  return reply.send(me);
};

export const changeAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.user;

  const file = await request.file({
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  });

  if (!file) return reply.code(400).send({ error: "Imagem é obrigatória" });

  if (file.fieldname !== "avatar")
    return reply.code(400).send({ error: "Campo inválido, esperado: avatar" });

  const buffer = await file.toBuffer();

  const type = await fileTypeFromBuffer(buffer);

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  if (!type || !allowed.includes(type.mime))
    return reply.code(400).send({ error: "Formato não permitido" });

  const bucket = process.env.MINIO_ADMIN_BUCKET ?? "admin";
  const destinationObject = "admin-avatar";
  const metaData = {
    "Content-Type": "image/webp",
  };

  try {
    const output = await sharp(buffer)
      .rotate()
      .resize({
        width: 200,
        height: 200,
        fit: "cover",
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
      metaData,
    );
  } catch (err) {
    console.error(err);

    return reply
      .code(400)
      .send({ error: "Arquivo inválido ou imagem corrompida" });
  }

  const imageUrl = `${process.env.MINIO_PUBLIC_URL}/${bucket}/${destinationObject}`;

  const avatar = await prisma.admin.update({
    where: { id },
    data: {
      image: imageUrl,
    },
    select: {
      image: true,
    },
  });

  return reply.send(avatar);
};
