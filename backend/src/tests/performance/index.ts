import { baseURL } from "./config.js";
import { loginPerf } from "./auth/login.perf.js";
import { getOccurrencesPerf } from "./occurrences/get-occurrences.perf.js";

const performanceTest = async () => {
  await loginPerf(baseURL);
  await getOccurrencesPerf(baseURL);
};

performanceTest();
