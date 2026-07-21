process.loadEnvFile();

const requireEnv = (name: string) => {
  const value = process.env[name];

  if (!value) throw new Error(`É necessário preencher o campo: ${name}`);

  return value;
};

export const baseURL = requireEnv("BASE_URL");
export const adminEmail = requireEnv("ADMIN_EMAIL");
export const adminPassword = requireEnv("ADMIN_PASSWORD");
export const disableRateLimit =
  process.env.DISABLE_RATE_LIMIT?.toLowerCase() === "true";

export const defaultOptions = {
  connections: 10,
  pipelining: 1,
  duration: 20,
};
