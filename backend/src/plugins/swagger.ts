import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { OccurrenceSource } from "../../prisma/src/generated/prisma/enums.js";

const swaggerConfig = {
  openapi: {
    info: {
      title: "Central de Ocorrências",
      description:
        "API para registro e acompanhamento de ocorrências do condomínio.",
      version: "1.0.0",
    },
  },

  transform: (params: Parameters<typeof jsonSchemaTransform>[0]) => {
    const { schema, url } = jsonSchemaTransform(params);

    if (url === "/me/avatar") {
      schema.body = {
        type: "object",
        required: ["avatar"],
        properties: {
          avatar: {
            type: "string",
            format: "binary",
            description:
              "Arquivo de imagem. Formatos aceitos: JPEG, PNG, WebP, HEIC e HEIF",
          },
        },
      };
    }

    if (url === "/public/occurrences") {
      schema.body = {
        type: "object",
        required: ["title", "description", "location", "source"],
        properties: {
          title: {
            type: "string",
            description: "Título da ocorrência",
          },
          description: {
            type: "string",
            description: "Descrição detalhada da ocorrência",
          },
          location: {
            type: "string",
            description: "Local onde a ocorrência ocorreu",
          },
          source: {
            type: "string",
            enum: Object.values(OccurrenceSource),
            description:
              "Origem da ocorrência: EMPLOYEE para funcionários e RESIDENT para moradores",
          },
          occurrence: {
            type: "string",
            format: "binary",
            description:
              "Arquivo de imagem opcional da ocorrência. Formatos aceitos: JPEG, PNG, WebP, HEIC e HEIF",
          },
        },
      };
    }

    return {
      schema,
      url,
    };
  },
};

export default swaggerConfig;
