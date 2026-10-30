import { AlertCircleIcon, ListTodoIcon } from "lucide-react";
import { type ReactNode, type SubmitEvent, useState } from "react";
import { Link, useLocation } from "react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./auth-provider";

// Same rules as RegisterDto in the API.
const USERNAME_PATTERN = /^[\w.-]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function SignInForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { pending, error, submit } = useSubmit();

  const canSubmit = email.trim() !== "" && password !== "" && !pending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    // On success GuestOnly sees the account and redirects.
    submit(() => signIn({ email: email.trim(), password }));
  }

  return (
    <AuthCard
      title="Sign in"
      description="Welcome back. Sign in to see your todos."
      onSubmit={handleSubmit}
      footer={
        <>
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
          <SwitchLink prompt="No account yet?" to="/sign-up" label="Sign up" />
        </>
      }
    >
      {error && <FormError message={error} />}
      <Field id="email" label="Email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          required
        />
      </Field>
      <Field id="password" label="Password">
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </Field>
    </AuthCard>
  );
}

export function SignUpForm() {
  const { signUp } = useAuth();
  const [draft, setDraft] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const { pending, error, submit } = useSubmit();

  const name = draft.name.trim();
  const username = draft.username.trim().replace(/^@/, "");
  const email = draft.email.trim();
  // Only flag a field once something is typed in it.
  const usernameInvalid = username !== "" && !USERNAME_PATTERN.test(username);
  const passwordTooShort =
    draft.password !== "" && draft.password.length < MIN_PASSWORD_LENGTH;
  const canSubmit =
    name !== "" &&
    username !== "" &&
    !usernameInvalid &&
    email !== "" &&
    draft.password.length >= MIN_PASSWORD_LENGTH &&
    !pending;

  function update(field: keyof typeof draft, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    submit(() => signUp({ name, username, email, password: draft.password }));
  }

  return (
    <AuthCard
      title="Create an account"
      description="Sign up to start keeping your todos."
      onSubmit={handleSubmit}
      footer={
        <>
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {pending ? "Creating account…" : "Sign up"}
          </Button>
          <SwitchLink
            prompt="Already have an account?"
            to="/sign-in"
            label="Sign in"
          />
        </>
      }
    >
      {error && <FormError message={error} />}
      <Field id="name" label="Name">
        <Input
          id="name"
          autoComplete="name"
          value={draft.name}
          onChange={(event) => update("name", event.target.value)}
          autoFocus
          required
        />
      </Field>
      <Field id="username" label="Username">
        <Input
          id="username"
          autoComplete="username"
          value={draft.username}
          onChange={(event) => update("username", event.target.value)}
          aria-invalid={usernameInvalid}
          required
        />
        {usernameInvalid && (
          <p className="text-destructive text-xs">
            Letters, numbers, dots, dashes and underscores only.
          </p>
        )}
      </Field>
      <Field id="email" label="Email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={draft.email}
          onChange={(event) => update("email", event.target.value)}
          required
        />
      </Field>
      <Field id="password" label="Password">
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={draft.password}
          onChange={(event) => update("password", event.target.value)}
          aria-invalid={passwordTooShort}
          required
        />
        <p
          className={
            passwordTooShort
              ? "text-destructive text-xs"
              : "text-muted-foreground text-xs"
          }
        >
          At least {MIN_PASSWORD_LENGTH} characters.
        </p>
      </Field>
    </AuthCard>
  );
}

// Tracks one in-flight request and the error it failed with.
function useSubmit() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (action: () => Promise<void>) => {
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPending(false);
    }
    // On success the form unmounts (GuestOnly redirects), so pending stays set.
  };

  return { pending, error, submit };
}

type AuthCardProps = {
  title: string;
  description: string;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  footer: ReactNode;
  children: ReactNode;
};

function AuthCard({
  title,
  description,
  onSubmit,
  footer,
  children,
}: AuthCardProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 py-8">
      <span className="flex items-center gap-2 font-heading font-semibold text-xl">
        <ListTodoIcon className="size-5" />
        Todo App
      </span>
      <Card className="w-full max-w-sm">
        <form onSubmit={onSubmit} className="contents" noValidate>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">{children}</CardContent>
          <CardFooter className="flex-col gap-3">{footer}</CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Keeps the "from" location, so switching forms still returns there after.
function SwitchLink({
  prompt,
  to,
  label,
}: {
  prompt: string;
  to: string;
  label: string;
}) {
  const { state } = useLocation();
  return (
    <p className="text-muted-foreground text-sm">
      {prompt}{" "}
      <Link
        to={to}
        state={state}
        replace
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        {label}
      </Link>
    </p>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
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
