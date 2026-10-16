import { MailIcon, PencilIcon, UserIcon } from "lucide-react";
import { type ReactNode, type SubmitEvent, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Account } from "@/features/account/types";
import { statuses } from "@/features/todos/types";
import { initials } from "@/features/users/user-views";
import { useAppState } from "@/hooks/use-app-state";

export function AccountPage() {
  const { account, setAccount, todos } = useAppState();
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {editing ? (
        <ProfileForm
          account={account}
          onSave={(next) => {
            setAccount(next);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>{initials(account.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <CardTitle>{account.name}</CardTitle>
              <CardDescription>@{account.username}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => setEditing(true)}
            >
              <PencilIcon data-icon="inline-start" />
              Edit profile
            </Button>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <Row icon={<MailIcon />} label="Email">
                {account.email}
              </Row>
              <Row icon={<UserIcon />} label="Bio">
                {account.bio || (
                  <span className="text-muted-foreground">No bio yet.</span>
                )}
              </Row>
            </dl>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your todos</CardTitle>
          <CardDescription>
            {todos.todos.length} {todos.todos.length === 1 ? "todo" : "todos"}{" "}
            in total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-3 gap-3">
            {statuses.map(({ value, label }) => (
              <div key={value} className="rounded-lg border p-3">
                <dt className="text-muted-foreground text-xs">{label}</dt>
                <dd className="font-semibold text-2xl tabular-nums">
                  {todos.todos.filter((todo) => todo.status === value).length}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

type ProfileFormProps = {
  account: Account;
  onSave: (account: Account) => void;
  onCancel: () => void;
};

function ProfileForm({ account, onSave, onCancel }: ProfileFormProps) {
  // Edit a draft copy; the real account only changes on Save.
  const [draft, setDraft] = useState(account);

  const name = draft.name.trim();
  const username = draft.username.trim().replace(/^@/, "");
  const usernameValid = /^[\w.-]+$/.test(username);
  const canSave = name !== "" && usernameValid;

  function update(field: keyof Account, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    onSave({
      name,
      username,
      email: draft.email.trim(),
      bio: draft.bio.trim(),
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="contents">
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <CardDescription>
            Changes are kept in local state only.
          </CardDescription>
          <CardAction>
            <Avatar size="lg">
              <AvatarFallback>{initials(name || "?")}</AvatarFallback>
            </Avatar>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field id="name" label="Name">
            <Input
              id="name"
              value={draft.name}
              onChange={(event) => update("name", event.target.value)}
              aria-invalid={name === ""}
            />
          </Field>
          <Field id="username" label="Username">
            <Input
              id="username"
              value={draft.username}
              onChange={(event) => update("username", event.target.value)}
              aria-invalid={!usernameValid}
            />
            {!usernameValid && (
              <p className="text-destructive text-xs">
                Letters, numbers, dots, dashes and underscores only.
              </p>
            )}
          </Field>
          <Field id="email" label="Email">
            <Input
              id="email"
              type="email"
              value={draft.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </Field>
          <Field id="bio" label="Bio">
            <Input
              id="bio"
              value={draft.bio}
              onChange={(event) => update("bio", event.target.value)}
            />
          </Field>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSave}>
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
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
