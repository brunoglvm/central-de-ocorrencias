import { jsonSchemaTransform } from "fastify-type-provider-zod";

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

    return {
      schema,
      url,
    };
  },
};

export default swaggerConfig;
