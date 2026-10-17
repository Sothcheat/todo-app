import type { Status, Todo } from "./types";

// NestJS todo-api (../../nestjs/todo-api), served under the global "api" prefix.
const TODOS_API = `${import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"}/todos`;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    // Nest errors look like { statusCode, message, error }; message can be an array from ValidationPipe.
    const body = await res.json().catch(() => null);
    const message = body?.message ?? `HTTP ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }
  // 204 No Content (DELETE) has no body to parse.
  return res.status === 204 ? (undefined as T) : res.json();
}

export function fetchTodos() {
  return request<Todo[]>(TODOS_API);
}

export function createTodo(title: string) {
  return request<Todo>(TODOS_API, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function updateTodo(
  id: string,
  changes: Partial<{ title: string; status: Status }>,
) {
  return request<Todo>(`${TODOS_API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteTodo(id: string) {
  return request<void>(`${TODOS_API}/${id}`, { method: "DELETE" });
}
