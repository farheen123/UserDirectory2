import { type User, type CreateUserPayload } from '../types/user';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body?.message ?? `HTTP ${res.status}`) as Error & { details?: unknown };
    err.details = body?.errors;
    throw err;
  }
  return res.json() as Promise<T>;
}

export const userService = {
  getAll: (): Promise<User[]> =>
    fetch(`${BASE_URL}/users`).then(handleResponse<User[]>),

  getById: (id: number): Promise<User> =>
    fetch(`${BASE_URL}/users/${id}`).then(handleResponse<User>),

  create: (payload: CreateUserPayload): Promise<User> =>
    fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse<User>),

  update: (id: number, payload: CreateUserPayload): Promise<User> =>
    fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse<User>),

  delete: (id: number): Promise<void> =>
    fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }),
};
