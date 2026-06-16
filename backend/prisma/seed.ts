import { prisma } from "../src/lib/prisma.js";
import { seedAdmin } from "./seeds/admin.seed.js";
import { seedOccurrences } from "./seeds/occurrences.seed.js";

async function main() {
  await seedAdmin();
  await seedOccurrences();
}

main().finally(() => prisma.$disconnect());
