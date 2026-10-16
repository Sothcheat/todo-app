import { ListTodoIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Account, defaultAccount } from "@/features/account/types";
import { useTodos } from "@/features/todos/use-todos";
import { initials } from "@/features/users/user-views";
import type { AppState } from "@/hooks/use-app-state";
import { cn } from "@/lib/utils";
import { Clock } from "./clock";

const navItems = [
  { to: "/todos", label: "Todos", icon: ListTodoIcon },
  { to: "/users", label: "Users", icon: UsersIcon },
];

export function AppLayout() {
  // Lifted here (not in the pages) so todos and the profile survive navigation.
  const todos = useTodos();
  const [account, setAccount] = useState<Account>(defaultAccount);

  const appState: AppState = { todos, account, setAccount };

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 px-4">
          <span className="mr-2 hidden font-heading font-semibold text-xl sm:inline">
            Todo App
          </span>
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
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
