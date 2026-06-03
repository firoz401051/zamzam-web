import { createClient } from "@sanity/client";

export const backendClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-10-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});
