import { prisma } from "../../src/lib/prisma.js";
import { occurrencesData } from "../mocks/occurrences.mock.js";

export const seedOccurrences = async () => {
  await prisma.occurrence.deleteMany();

  await prisma.occurrence.createMany({
    data: occurrencesData,
  });

  console.log("Ocorrências de exemplo criadas");
};
