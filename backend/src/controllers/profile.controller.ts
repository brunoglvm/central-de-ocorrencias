import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma.js";
import { minioClient } from "@/lib/minio.js";
import sharp from "sharp";

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

  const file = await request.file();

  if (!file) {
    return reply.code(400).send({ error: "Imagem é obrigatória" });
  }

  if (file.fieldname !== "avatar") {
    return reply.code(400).send({ error: "Campo inválido, use avatar" });
  }

  const buffer = await file.toBuffer();

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

  const bucket = process.env.MINIO_ADMIN_BUCKET ?? "admin";
  const destinationObject = "admin-avatar";
  const metaData = {
    "Content-Type": "image/webp",
  };

  await minioClient.putObject(
    bucket,
    destinationObject,
    output,
    output.length,
    metaData,
  );

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
