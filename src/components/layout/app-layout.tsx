import { ListTodoIcon, LogOutIcon, UsersIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAccount, useAuth } from "@/features/auth/auth-provider";
import { useTodos } from "@/features/todos/use-todos";
import { initials } from "@/features/users/user-views";
import type { AppState } from "@/hooks/use-app-state";
import { cn } from "@/lib/utils";
import { Clock } from "./clock";

// adminOnly links are hidden from everyone else (the pages are guarded too).
const navItems = [
  { to: "/todos", label: "Todos", icon: ListTodoIcon },
  { to: "/users", label: "Users", icon: UsersIcon, adminOnly: true },
];

export function AppLayout() {
  // Lifted here (not in the pages) so todos survive navigation. This layout
  // only renders signed in, so signing out unmounts it and drops the todos.
  const todos = useTodos();
  const account = useAccount();
  const { signOut } = useAuth();

  const appState: AppState = { todos };

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 px-4">
          <span className="mr-2 hidden font-heading font-semibold text-xl sm:inline">
            Todo App
          </span>
          <nav className="flex items-center gap-1">
            {navItems
              .filter((item) => !item.adminOnly || account.role === "admin")
              .map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      buttonVariants({
                        variant: isActive ? "secondary" : "ghost",
                      }),
                    )
                  }
                >
                  <Icon data-icon="inline-start" />
                  {label}
                </NavLink>
              ))}
          </nav>
          <div className="ml-2 flex items-center gap-2">
            <div className="hidden md:block">
              <Clock />
            </div>
            <NavLink
              to="/account"
              aria-label="Your account"
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                  "gap-2 pl-1",
                )
              }
            >
              <Avatar size="sm">
                <AvatarFallback>{initials(account.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">@{account.username}</span>
            </NavLink>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              title="Sign out"
              onClick={signOut}
            >
              <LogOutIcon />
            </Button>
          </div>
        </div>
        <Separator />
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Outlet context={appState} />
      </main>
    </div>
  );
}
