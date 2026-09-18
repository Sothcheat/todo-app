import { ClockIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useNow } from "@/hooks/use-now";

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function Clock() {
  const now = useNow();

  return (
    <Badge variant="outline" className="font-mono tabular-nums">
      <ClockIcon data-icon="inline-start" />
      <time dateTime={now.toISOString()}>{timeFormat.format(now)}</time>
    </Badge>
  );
}
