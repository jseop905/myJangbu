/**
 * API 클라이언트 유틸
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new ApiError(response.status, error.message || response.statusText);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => fetcher<T>(url, { method: "GET" }),
  post: <T>(url: string, body?: unknown) =>
    fetcher<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body?: unknown) =>
    fetcher<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) => fetcher<T>(url, { method: "DELETE" }),
};

