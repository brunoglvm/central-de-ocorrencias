import { adminEmail, adminPassword } from "../config.js";

type LoginResponse = {
  token: string;
};

export const getAdminToken = async (baseURL: string) => {
  const response = await fetch(`${baseURL}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao autenticar admin para teste de performance: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as LoginResponse;

  return data.token;
};
