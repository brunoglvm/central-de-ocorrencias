import autocannon from "autocannon";
import { defaultOptions, adminEmail, adminPassword } from "../config.js";

export const loginPerf = async (baseURL: string) => {
  const result = await autocannon({
    ...defaultOptions,
    title: "POST /auth/login",
    url: `${baseURL}/auth/login`,
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
  });

  console.log(result);
};
