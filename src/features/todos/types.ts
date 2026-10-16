export type Status = "todo" | "in-progress" | "done";

export type Todo = {
  id: string;
  title: string;
  status: Status;
};

export type Filter = "all" | Status;

export const statuses: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];
