import { prisma } from "../src/lib/prisma.js";
import { updateAdminCredentials } from "./seeds/admin.seed.js";

async function main() {
  await updateAdminCredentials();
}

main().finally(() => prisma.$disconnect());
