import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TodoFooterProps = {
  remainingCount: number;
  doneCount: number;
  onClearDone: () => void;
};

export function TodoFooter({
  remainingCount,
  doneCount,
  onClearDone,
}: TodoFooterProps) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <span className="text-muted-foreground text-sm">
        {remainingCount} {remainingCount === 1 ? "item" : "items"} left
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={doneCount === 0}
        onClick={onClearDone}
        className="-mr-2.5"
      >
        <Trash2Icon data-icon="inline-start" />
        Clear done
      </Button>
    </div>
  );
}
