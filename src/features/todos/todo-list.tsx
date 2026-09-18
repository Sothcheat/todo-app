import { ListTodoIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Filter, Todo } from "./types";

const emptyMessages: Record<Filter, { title: string; description: string }> = {
  all: {
    title: "No todos yet",
    description: "Add one above to get started.",
  },
  active: {
    title: "No active todos",
    description: "You're all caught up.",
  },
  completed: {
    title: "No completed todos",
    description: "Check off a todo and it will show up here.",
  },
};

type TodoListProps = {
  todos: Todo[];
  filter: Filter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoList({ todos, filter, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    const { title, description } = emptyMessages[filter];
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListTodoIcon />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col divide-y">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center gap-3 py-2">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
          />
          <Label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              "flex-1 font-normal",
              todo.completed && "text-muted-foreground line-through",
            )}
          >
            {todo.text}
          </Label>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete "${todo.text}"`}
            className="hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20 dark:active:bg-destructive/30 dark:hover:bg-destructive/20"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2Icon />
          </Button>
        </li>
      ))}
    </ul>
  );
}
