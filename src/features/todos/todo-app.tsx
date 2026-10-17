import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppState } from "@/hooks/use-app-state";
import { AddTodo } from "./add-todo";
import { FilterTabs } from "./filter-tabs";
import { TodoFooter } from "./todo-footer";
import { TodoList } from "./todo-list";
import type { Filter } from "./types";

export function TodoApp() {
  const { todos: todosState, account } = useAppState();
  const {
    todos,
    loading,
    error,
    addTodo,
    renameTodo,
    setStatus,
    deleteTodo,
    clearDone,
  } = todosState;
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTodos =
    filter === "all" ? todos : todos.filter((todo) => todo.status === filter);

  const counts: Record<Filter, number> = {
    all: todos.length,
    todo: todos.filter((todo) => todo.status === "todo").length,
    "in-progress": todos.filter((todo) => todo.status === "in-progress").length,
    done: todos.filter((todo) => todo.status === "done").length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{account.name}&apos;s todos</CardTitle>
        <CardDescription>
          {loading
            ? "Loading your list…"
            : todos.length === 0
              ? "Nothing on your list yet."
              : `${counts.done} of ${todos.length} done`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <AddTodo onAdd={addTodo} />
        <FilterTabs
          filter={filter}
          counts={counts}
          onFilterChange={setFilter}
        />
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Couldn&apos;t reach the todo API</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <TodoListSkeleton />
        ) : (
          <TodoList
            todos={visibleTodos}
            filter={filter}
            onRename={renameTodo}
            onStatusChange={setStatus}
            onDelete={deleteTodo}
          />
        )}
      </CardContent>
      <CardFooter>
        <TodoFooter
          remainingCount={todos.length - counts.done}
          doneCount={counts.done}
          onClearDone={clearDone}
        />
      </CardFooter>
    </Card>
  );
}

function TodoListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="flex flex-col divide-y" aria-busy="true">
      {Array.from({ length: rows }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
        <li key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 flex-1" />
        </li>
      ))}
    </ul>
  );
}
