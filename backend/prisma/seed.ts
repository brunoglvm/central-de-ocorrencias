import { prisma } from "../src/lib/prisma.js";

async function main() {
  const occurrence = await prisma.occurrence.create({
    data: {
      title: "Teste Prisma",
      description: "Registro criado para validar a conexão com o Prisma.",
      location: "Portaria",
      source: "EMPLOYEE",
    },
  });

  const occurrences = await prisma.occurrence.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

main().finally(() => prisma.$disconnect());
