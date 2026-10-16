import { PlusIcon } from "lucide-react";
import { type SubmitEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTodoProps = {
  onAdd: (title: string) => void;
};

export function AddTodo({ onAdd }: AddTodoProps) {
  // Local UI state only — the todos array lives in useTodos.
  const [title, setTitle] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        aria-label="New todo"
      />
      <Button type="submit" disabled={!title.trim()}>
        <PlusIcon data-icon="inline-start" />
        Add
      </Button>
    </form>
  );
}
