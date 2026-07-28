import { env } from "@/lib/env";

export type StrapiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
};

export async function strapiClient<T>(
  path: string,
  options: StrapiRequestOptions = {}
): Promise<T> {
  const url = `${env.STRAPI_URL}${path}`;
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
