import { CompassIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CompassIcon />
        </EmptyMedia>
        <EmptyTitle>404 — Page not found</EmptyTitle>
        <EmptyDescription>
          Nothing lives at <code className="font-mono">{pathname}</code>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/todos" className={buttonVariants()}>
          Back to todos
        </Link>
      </EmptyContent>
    </Empty>
  );
}
