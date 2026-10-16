import { cn } from "@/lib/utils";
import { type Status, statuses } from "./types";

const statusStyles: Record<Status, string> = {
  todo: "border-input text-muted-foreground",
  "in-progress":
    "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  done: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

type StatusSelectProps = {
  status: Status;
  label: string;
  onChange: (status: Status) => void;
};

export function StatusSelect({ status, label, onChange }: StatusSelectProps) {
  return (
    <select
      value={status}
      onChange={(event) => onChange(event.target.value as Status)}
      aria-label={label}
      className={cn(
        "dark:scheme-dark h-7 w-28 shrink-0 cursor-pointer rounded-lg border bg-transparent px-2 font-medium text-xs outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        statusStyles[status],
      )}
    >
      {statuses.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
