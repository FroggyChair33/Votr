const BASE_URL = 'http://localhost:8000';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function request<T>(
  method: Method,
  path: string,
  body?: Record<string, unknown> | URLSearchParams,
): Promise<T> {
  const isForm = body instanceof URLSearchParams;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: isForm
      ? { 'Content-Type': 'application/x-www-form-urlencoded' }
      : body
      ? { 'Content-Type': 'application/json' }
      : {},
    body: body
      ? isForm
        ? body.toString()
        : JSON.stringify(body)
      : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail ?? 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
