import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddTodo } from "./add-todo";
import { FilterTabs } from "./filter-tabs";
import { TodoFooter } from "./todo-footer";
import { TodoList } from "./todo-list";
import type { Filter, Todo } from "./types";

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      case "all":
        return true;
      default:
        return true;
    }
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  // handler

  const addTodo = (text: string) => {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos</CardTitle>
        <CardDescription>
          {todos.length === 0
            ? "Nothing on your list yet."
            : `${completedCount} of ${todos.length} completed`}
        </CardDescription>
        <CardAction>
          <FilterTabs filter={filter} onFilterChange={setFilter} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <AddTodo onAdd={addTodo} />
        <TodoList
          todos={visibleTodos}
          filter={filter}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </CardContent>
      <CardFooter>
        <TodoFooter
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      </CardFooter>
    </Card>
  );
}
