import path from "node:path";
import { fileURLToPath } from "node:url";
import { OccurrenceSource } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const occurrenceFixture = {
  title: "Barulho excessivo no apartamento 101",
  description: "Som alto durante a noite atrapalhando vizinhos.",
  image: path.join(__dirname, "images", "occurrence.jpg"),
  location: "Bloco A - 101",
  source: OccurrenceSource.RESIDENT,
};
