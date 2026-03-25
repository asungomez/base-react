import { API } from "aws-amplify";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

const localFetch = async (
  method: string,
  path: string,
  {
    queryParams,
    body,
  }: { queryParams?: Record<string, string | undefined>; body?: unknown } = {}
) => {
  const url = new URL(path, API_URL);
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

export const del = async (path: string) => {
  if (API_URL) return localFetch("DELETE", path);
  return API.del("dataapi", path, {});
};

export const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined } = {}
) => {
  if (API_URL) return localFetch("GET", path, { queryParams });
  return API.get("dataapi", path, {
    queryStringParameters: queryParams,
  });
};

export const post = async (
  path: string,
  body: { [param: string]: unknown } = {}
) => {
  if (API_URL) return localFetch("POST", path, { body });
  return API.post("dataapi", path, {
    body,
  });
};

export const put = async (
  path: string,
  body: { [param: string]: unknown } = {}
) => {
  if (API_URL) return localFetch("PUT", path, { body });
  return API.put("dataapi", path, {
    body,
  });
};
