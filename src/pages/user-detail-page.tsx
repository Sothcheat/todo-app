import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  MailIcon,
  SearchXIcon,
  ShieldIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "@/features/auth/auth-provider";
import { fetchTodos } from "@/features/todos/api";
import { statuses, type Todo } from "@/features/todos/types";
import { deleteUser, fetchUsers, updateUserRole } from "@/features/users/api";
import type { User } from "@/features/users/types";
import { initials, RoleBadge, UserError } from "@/features/users/user-views";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "not-found" }
  | { status: "success"; user: User; todos: Todo[] };

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<State>({ status: "loading" });

  // The URL param drives the fetch: navigating between users re-runs it.
  // The API has no GET /users/:id, so find them in the full list.
  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    async function load() {
      try {
        const user = (await fetchUsers()).find((u) => u.id === id);
        if (!user) {
          if (!cancelled) setState({ status: "not-found" });
          return;
        }
        const todos = await fetchTodos(user.id);
        if (!cancelled) setState({ status: "success", user, todos });
      } catch (err) {
        if (!cancelled)
          setState({ status: "error", message: errorMessage(err) });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/users"
        className={buttonVariants({
          variant: "ghost",
          className: "self-start",
        })}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        All users
      </Link>
      {state.status === "loading" && <DetailSkeleton />}
      {state.status === "error" && <UserError message={state.message} />}
      {state.status === "not-found" && <UserNotFound id={id} />}
      {state.status === "success" && (
        <>
          <UserCard
            user={state.user}
            onRoleChange={(user) => setState({ ...state, user })}
          />
          <UserTodos todos={state.todos} />
        </>
      )}
    </div>
  );
}

type UserCardProps = {
  user: User;
  onRoleChange: (user: User) => void;
};

function UserCard({ user, onRoleChange }: UserCardProps) {
  const account = useAccount();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The API refuses both actions on your own account, so there's always an admin left.
  const isSelf = user.id === account.userId;
  const nextRole = user.role === "admin" ? "user" : "admin";

  async function run(action: () => Promise<void>) {
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const changeRole = () =>
    run(async () => {
      await updateUserRole(user.id, nextRole);
      onRoleChange({ ...user, role: nextRole });
    });

  const remove = () =>
    run(async () => {
      await deleteUser(user.id);
      navigate("/users", { replace: true });
    });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>@{user.username}</CardDescription>
        </div>
        <RoleBadge role={user.role} className="ml-auto" />
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <dl className="grid gap-3 text-sm">
          <Row icon={<MailIcon />} label="Email">
            {user.email}
          </Row>
          <Row icon={<UserIcon />} label="Bio">
            {user.bio || (
              <span className="text-muted-foreground">No bio yet.</span>
            )}
          </Row>
          <Row icon={<CalendarIcon />} label="Joined">
            {new Date(user.createdAt).toLocaleDateString()}
          </Row>
        </dl>
      </CardContent>
      <CardFooter className="flex-wrap justify-end gap-2">
        {isSelf ? (
          <p className="mr-auto text-muted-foreground text-sm">
            This is you. Another admin has to change your role or delete you.
          </p>
        ) : confirmingDelete ? (
          <>
            <p className="mr-auto text-sm">
              Delete @{user.username} and all their todos?
            </p>
            <Button
              variant="ghost"
              disabled={pending}
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" disabled={pending} onClick={remove}>
              {pending ? "Deleting…" : "Delete user"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" disabled={pending} onClick={changeRole}>
              <ShieldIcon data-icon="inline-start" />
              {nextRole === "admin" ? "Make admin" : "Remove admin"}
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2Icon data-icon="inline-start" />
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function UserTodos({ todos }: { todos: Todo[] }) {
  const label = (status: Todo["status"]) =>
    statuses.find((s) => s.value === status)?.label ?? status;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Their todos</CardTitle>
        <CardDescription>
          {todos.length === 0
            ? "Nothing on their list."
            : `${todos.filter((t) => t.status === "done").length} of ${todos.length} done`}
        </CardDescription>
      </CardHeader>
      {todos.length > 0 && (
        <CardContent>
          <ul className="flex flex-col divide-y">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1 truncate text-sm">
                  {todo.title}
                </span>
                <Badge variant="outline">{label(todo.status)}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <dt className="flex w-24 shrink-0 items-center gap-2 text-muted-foreground [&_svg]:size-4">
        {icon}
        {label}
      </dt>
      <dd className="wrap-break-word min-w-0">{children}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <Card aria-busy="true">
      <CardHeader className="flex flex-row items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function UserNotFound({ id }: { id?: string }) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>User not found</EmptyTitle>
        <EmptyDescription>
          There&apos;s no user with id <code className="font-mono">{id}</code>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/users" className={buttonVariants()}>
          Back to directory
        </Link>
      </EmptyContent>
    </Empty>
  );
}
