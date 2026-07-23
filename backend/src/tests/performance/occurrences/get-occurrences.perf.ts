import autocannon from "autocannon";
import { defaultOptions } from "../config.js";
import { getAdminToken } from "../helpers/get-admin-token.js";

export const getOccurrencesPerf = async (baseURL: string) => {
  const token = await getAdminToken(baseURL);

  const result = await autocannon({
    ...defaultOptions,
    title: "GET /occurrences",
    url: `${baseURL}/occurrences`,
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  console.log(result);
};
