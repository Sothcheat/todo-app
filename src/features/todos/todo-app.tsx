import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppState } from "@/hooks/use-app-state";
import { AddTodo } from "./add-todo";
import { FilterTabs } from "./filter-tabs";
import { TodoFooter } from "./todo-footer";
import { TodoList } from "./todo-list";
import type { Filter } from "./types";

export function TodoApp() {
  const { todos: todosState, account } = useAppState();
  const { todos, addTodo, renameTodo, setStatus, deleteTodo, clearDone } =
    todosState;
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
          {todos.length === 0
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
        <TodoList
          todos={visibleTodos}
          filter={filter}
          onRename={renameTodo}
          onStatusChange={setStatus}
          onDelete={deleteTodo}
        />
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
