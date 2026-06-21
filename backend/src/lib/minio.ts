import * as Minio from "minio";
import { z } from "zod";

const minioEnvSchema = z.object({
  MINIO_ENDPOINT: z.string().min(1).default("127.0.0.1"),
  MINIO_PORT: z.coerce.number().int().positive().default(9000),
  MINIO_USE_SSL: z.coerce.boolean().default(false),
  MINIO_ACCESS_KEY: z.string().min(1).default("admin"),
  MINIO_SECRET_KEY: z.string().min(1).default("minioadmin"),
});

const minioEnv = minioEnvSchema.parse(process.env);

export const minioClient = new Minio.Client({
  endPoint: minioEnv.MINIO_ENDPOINT,
  port: minioEnv.MINIO_PORT,
  useSSL: minioEnv.MINIO_USE_SSL,
  accessKey: minioEnv.MINIO_ACCESS_KEY,
  secretKey: minioEnv.MINIO_SECRET_KEY,
});
