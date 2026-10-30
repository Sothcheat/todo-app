import { LoaderCircleIcon, ShieldAlertIcon } from "lucide-react";
import { Link, Navigate, Outlet, useLocation } from "react-router";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Role } from "@/features/account/types";
import { useAccount, useAuth } from "./auth-provider";

type FromState = { from?: string } | null;

function SessionLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center text-muted-foreground">
      <LoaderCircleIcon className="size-5 animate-spin" aria-label="Loading" />
    </div>
  );
}

// Routes inside need a signed-in user; others go to /sign-in and come back after.
export function RequireAuth() {
  const { account, loading } = useAuth();
  const location = useLocation();

  if (loading) return <SessionLoading />;
  if (!account) {
    const from = location.pathname + location.search;
    return <Navigate to="/sign-in" replace state={{ from }} />;
  }
  return <Outlet />;
}

// Sign-in and sign-up only make sense signed out. Signing in re-renders this
// with an account, which sends the user back to where they were headed.
export function GuestOnly() {
  const { account, loading } = useAuth();
  const from = (useLocation().state as FromState)?.from;

  if (loading) return <SessionLoading />;
  if (account) return <Navigate to={from ?? "/todos"} replace />;
  return <Outlet />;
}

// Nest inside <RequireAuth>. Hiding pages is only for a tidy UI: the API
// checks the role on every request and answers 403 regardless.
export function RequireRole({ allow }: { allow: Role }) {
  const account = useAccount();
  if (account.role !== allow) return <Forbidden />;
  return <Outlet />;
}

function Forbidden() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldAlertIcon />
        </EmptyMedia>
        <EmptyTitle>Admins only</EmptyTitle>
        <EmptyDescription>
          Your account doesn&apos;t have access to this page.
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
