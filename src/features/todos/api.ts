import { apiFetch } from "@/lib/api";
import type { Status, Todo } from "./types";

// Your own todos, or (admins only) another user's.
export function fetchTodos(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return apiFetch<Todo[]>(`/todos${query}`);
}

export function createTodo(title: string) {
  return apiFetch<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function updateTodo(
  id: string,
  changes: Partial<{ title: string; status: Status }>,
) {
  return apiFetch<Todo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteTodo(id: string) {
  return apiFetch<void>(`/todos/${id}`, { method: "DELETE" });
}
