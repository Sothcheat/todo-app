import { AlertCircleIcon, ChevronRightIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "./types";

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** State 1: loading */
export function UserListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="flex flex-col divide-y" aria-busy="true">
      {Array.from({ length: rows }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
        <li key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** State 2: error */
export function UserError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Couldn&apos;t load users</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/** State 3: empty */
export function UserEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon />
        </EmptyMedia>
        <EmptyTitle>No users found</EmptyTitle>
        <EmptyDescription>The directory is empty right now.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

/** State 4: data */
export function UserList({ users }: { users: User[] }) {
  return (
    <ul className="flex flex-col divide-y">
      {users.map((user) => (
        <li key={user.id}>
          <Link
            to={`/users/${user.id}`}
            className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-muted"
          >
            <Avatar>
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-muted-foreground text-sm">
                {user.email}
              </span>
            </div>
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
