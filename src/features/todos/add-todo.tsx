import { PlusIcon } from "lucide-react";
import { type SubmitEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTodoProps = {
  onAdd: (text: string) => void;
};

export function AddTodo({ onAdd }: AddTodoProps) {
  // Local UI state only — the todos array lives in TodoApp.
  const [text, setText] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs to be done?"
        aria-label="New todo"
      />
      <Button type="submit" disabled={!text.trim()}>
        <PlusIcon data-icon="inline-start" />
        Add
      </Button>
    </form>
  );
}
