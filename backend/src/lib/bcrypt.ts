import { Admin } from "../../prisma/src/generated/prisma/client.js";
import bcrypt from "bcryptjs";

export const validateLogin = async (admin: Admin, password: string) => {
  return bcrypt.compare(password, admin.password);
};
