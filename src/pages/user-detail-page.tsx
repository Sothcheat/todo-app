import {
  ArrowLeftIcon,
  BuildingIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SearchXIcon,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { USERS_API, type User } from "@/features/users/types";
import { initials, UserError } from "@/features/users/user-views";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "not-found" }
  | { status: "success"; user: User };

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<State>({ status: "loading" });

  // The URL param drives the fetch: navigating /users/1 → /users/2 re-runs it.
  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    if (!id || !/^\d+$/.test(id)) {
      setState({ status: "not-found" });
      return;
    }

    async function load() {
      try {
        const res = await fetch(`${USERS_API}/${id}`);
        if (res.status === 404) {
          if (!cancelled) setState({ status: "not-found" });
          return;
        }
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const user: User = await res.json();
        if (!cancelled) setState({ status: "success", user });
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Unknown error",
          });
        }
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
      {state.status === "success" && <UserCard user={state.user} />}
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  const { street, suite, city, zipcode } = user.address;

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
        <Badge variant="secondary" className="ml-auto">
          #{user.id}
        </Badge>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm">
          <Row icon={<MailIcon />} label="Email">
            <a href={`mailto:${user.email}`} className="hover:underline">
              {user.email}
            </a>
          </Row>
          <Row icon={<PhoneIcon />} label="Phone">
            {user.phone}
          </Row>
          <Row icon={<GlobeIcon />} label="Website">
            {user.website}
          </Row>
          <Row icon={<BuildingIcon />} label="Company">
            {user.company.name}
            <span className="text-muted-foreground">
              {" "}
              — {user.company.catchPhrase}
            </span>
          </Row>
          <Row icon={<MapPinIcon />} label="Address">
            {street}, {suite}, {city} {zipcode}
          </Row>
        </dl>
      </CardContent>
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
      <dd className="min-w-0 break-words">{children}</dd>
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
        {Array.from({ length: 5 }, (_, i) => (
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
