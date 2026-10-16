import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type Filter, statuses } from "./types";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...statuses,
];

type FilterTabsProps = {
  filter: Filter;
  counts: Record<Filter, number>;
  onFilterChange: (filter: Filter) => void;
};

export function FilterTabs({
  filter,
  counts,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      className="flex-wrap"
      value={[filter]}
      onValueChange={(value) => {
        // Ignore deselecting the active item — one filter is always on.
        const next = value[0] as Filter | undefined;
        if (next) onFilterChange(next);
      }}
    >
      {filters.map(({ value, label }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          // Default pressed style is bg-muted (too faint); use primary instead.
          className="aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90 aria-pressed:hover:text-primary-foreground"
        >
          {label}
          <span className="tabular-nums opacity-70">{counts[value]}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
