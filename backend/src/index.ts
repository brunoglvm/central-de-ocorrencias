import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";
import { fastifyRateLimit } from "@fastify/rate-limit";
import { fastifyMultipart } from "@fastify/multipart";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { routes } from "@/routes/index.js";
import jwtPlugin from "@/plugins/jwt.js";
import swaggerConfig from "./plugins/swagger.js";
import errorHandlerPlugin from "./plugins/error-handler.js";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

app.register(jwtPlugin);

app.register(fastifySwagger, swaggerConfig);

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

app.register(fastifyMultipart, {
  limits: {
    files: 1,
  },
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(errorHandlerPlugin);

app.register(routes);

const port = Number(process.env.PORT ?? 3333);
const host = process.env.HOST ?? "0.0.0.0";

app.listen({ port, host }).then(() => {
  console.log(`Aplicação: http://localhost:${port}`);
  console.log(`Documentação: http://localhost:${port}/docs`);
});
