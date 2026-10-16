import { useState } from "react";
import type { Status, Todo } from "./types";

// All todo CRUD lives here, in local state only — no backend.
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Create
  const addTodo = (title: string) => {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, status: "todo" },
    ]);
  };

  // Update
  const renameTodo = (id: string, title: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
    );
  };

  const setStatus = (id: string, status: Status) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, status } : todo)),
    );
  };

  // Delete
  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearDone = () => {
    setTodos((prev) => prev.filter((todo) => todo.status !== "done"));
  };

  return { todos, addTodo, renameTodo, setStatus, deleteTodo, clearDone };
}

export type TodosState = ReturnType<typeof useTodos>;
