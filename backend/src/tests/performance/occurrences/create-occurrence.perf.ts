import autocannon from "autocannon";
import { defaultOptions } from "../config.js";
import { occurrenceFixture } from "@/tests/fixtures/occurrence.js";

export const createOccurrencePerf = async (baseURL: string) => {
  const result = await autocannon({
    ...defaultOptions,
    title: "POST /public/occurrences",
    url: `${baseURL}/public/occurrences`,
    method: "POST",
    form: {
      title: {
        type: "text",
        value: occurrenceFixture.title,
      },
      description: {
        type: "text",
        value: occurrenceFixture.description,
      },
      location: {
        type: "text",
        value: occurrenceFixture.location,
      },
      source: {
        type: "text",
        value: occurrenceFixture.source,
      },
      occurrence: {
        type: "file",
        path: occurrenceFixture.image,
      },
    },
  });

  console.log(result);
};
