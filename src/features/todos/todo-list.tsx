import {
  CheckIcon,
  ListTodoIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { type SubmitEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { StatusSelect } from "./status-select";
import type { Filter, Status, Todo } from "./types";

const emptyMessages: Record<Filter, { title: string; description: string }> = {
  all: {
    title: "No todos yet",
    description: "Add one above to get started.",
  },
  todo: {
    title: "Nothing to do",
    description: "Every todo has been started or finished.",
  },
  "in-progress": {
    title: "Nothing in progress",
    description: "Set a todo to In Progress and it will show up here.",
  },
  done: {
    title: "Nothing done yet",
    description: "Mark a todo as Done and it will show up here.",
  },
};

type TodoListProps = {
  todos: Todo[];
  filter: Filter;
  onRename: (id: string, title: string) => void;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
};

export function TodoList({
  todos,
  filter,
  onRename,
  onStatusChange,
  onDelete,
}: TodoListProps) {
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
        <TodoItem
          key={todo.id}
          todo={todo}
          onRename={onRename}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

type TodoItemProps = {
  todo: Todo;
  onRename: (id: string, title: string) => void;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
};

function TodoItem({ todo, onRename, onStatusChange, onDelete }: TodoItemProps) {
  // Local UI state only — the todo itself lives in useTodos.
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  function startEditing() {
    setDraft(todo.title);
    setEditing(true);
  }

  function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onRename(todo.id, trimmed);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="py-2">
        <form onSubmit={handleSave} className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setEditing(false);
            }}
            aria-label={`Edit title of "${todo.title}"`}
            autoFocus
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Save"
            disabled={!draft.trim()}
          >
            <CheckIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Cancel"
            onClick={() => setEditing(false)}
          >
            <XIcon />
          </Button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 py-2">
      <StatusSelect
        status={todo.status}
        label={`Status of "${todo.title}"`}
        onChange={(status) => onStatusChange(todo.id, status)}
      />
      <span
        className={cn(
          "wrap-break-word min-w-0 flex-1",
          todo.status === "done" && "text-muted-foreground line-through",
        )}
      >
        {todo.title}
      </span>
      <div className="flex shrink-0">
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Edit "${todo.title}"`}
          onClick={startEditing}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete "${todo.title}"`}
          className="hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20 dark:active:bg-destructive/30 dark:hover:bg-destructive/20"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2Icon />
        </Button>
      </div>
    </li>
  );
}
