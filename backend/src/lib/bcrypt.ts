import { Admin } from "@prisma/client";
import bcrypt from "bcryptjs";

export const validateLogin = async (admin: Admin, password: string) => {
  return bcrypt.compare(password, admin.password);
};
