import { useEffect, useState } from "react";
import * as api from "./api";
import type { Status, Todo } from "./types";

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

// All todo CRUD lives here, backed by the NestJS todo-api.
// Each change waits for the server, then updates local state with its response.
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read
  useEffect(() => {
    let cancelled = false;
    const loadTodos = async () => {
      try {
        const data = await api.fetchTodos();
        if (!cancelled) setTodos(data);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadTodos();

    return () => {
      cancelled = true;
    };
  }, []);

  // Runs a request, clearing the previous error and recording a new one.
  const run = async (action: () => Promise<void>) => {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const replaceTodo = (updated: Todo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updated.id ? updated : todo)),
    );
  };

  // Create
  const addTodo = (title: string) =>
    run(async () => {
      const created = await api.createTodo(title);
      setTodos((prev) => [...prev, created]);
    });

  // Update
  const renameTodo = (id: string, title: string) =>
    run(async () => replaceTodo(await api.updateTodo(id, { title })));

  const setStatus = (id: string, status: Status) =>
    run(async () => replaceTodo(await api.updateTodo(id, { status })));

  // Delete
  const deleteTodo = (id: string) =>
    run(async () => {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    });

  // The API has no bulk delete, so delete each done todo and keep the ones that failed.
  const clearDone = () =>
    run(async () => {
      const done = todos.filter((todo) => todo.status === "done");
      const results = await Promise.allSettled(
        done.map((todo) => api.deleteTodo(todo.id)),
      );
      const deleted = new Set(
        done
          .filter((_, i) => results[i].status === "fulfilled")
          .map((t) => t.id),
      );
      setTodos((prev) => prev.filter((todo) => !deleted.has(todo.id)));

      const failed = results.find((r) => r.status === "rejected");
      if (failed) throw failed.reason;
    });

  return {
    todos,
    loading,
    error,
    addTodo,
    renameTodo,
    setStatus,
    deleteTodo,
    clearDone,
  };
}

export type TodosState = ReturnType<typeof useTodos>;
