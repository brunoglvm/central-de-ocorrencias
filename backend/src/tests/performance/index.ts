import { loginPerf } from "./auth/login.perf.js";
import { baseURL } from "./config.js";

const performanceTest = async () => {
  await loginPerf(baseURL);
};

performanceTest();
