import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "zgohm53x",
  dataset: "production",
  apiVersion: "2024-11-01",
  useCdn: false,
});