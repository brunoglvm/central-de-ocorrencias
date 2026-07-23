import { loginPerf } from "./auth/login.perf.js";
import { baseURL } from "./config.js";
import { createOccurrencePerf } from "./occurrences/create-occurrence.perf.js";

const performanceTest = async () => {
  // await loginPerf(baseURL);
  await createOccurrencePerf(baseURL);
};

performanceTest();
