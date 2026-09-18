import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TodoFooterProps = {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

export function TodoFooter({
  activeCount,
  completedCount,
  onClearCompleted,
}: TodoFooterProps) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <span className="text-muted-foreground text-sm">
        {activeCount} {activeCount === 1 ? "item" : "items"} left
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
        className="-mr-2.5"
      >
        <Trash2Icon data-icon="inline-start" />
        Clear completed
      </Button>
    </div>
  );
}
