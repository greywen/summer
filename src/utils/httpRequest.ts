import fetch from 'node-fetch';

export async function httpRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  }).then((res): Promise<T> => res.json());
  return res;
}

export async function httpPost<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  init.method = 'POST';
  return httpRequest<T>(input, init);
}

export async function httpGet<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  return httpRequest<T>(input, { method: 'GET', ...init });
}
