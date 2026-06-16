import bcrypt from "bcryptjs";
import { prisma } from "../../src/lib/prisma.js";

export const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no .env",
    );
  }

  const adminCount = await prisma.admin.count();

  if (adminCount > 0) {
    console.log("Admin já existe, criação ignorada");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log("Admin criado");
};

export const updateAdminCredentials = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no .env",
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { id: 1 },
  });

  if (!admin) {
    console.log("Admin não encontrado, sincronização ignorada");
    return;
  }

  const emailChanged = admin.email !== email;

  const passwordChanged = !(await bcrypt.compare(password, admin.password));

  if (!emailChanged && !passwordChanged) {
    console.log("Credenciais do admin já estão sincronizadas");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.update({
    where: { id: 1 },
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log("Credenciais do admin atualizadas");
};
