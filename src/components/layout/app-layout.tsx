import { ListTodoIcon, UsersIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Clock } from "./clock";

const navItems = [
  { to: "/todos", label: "Todos", icon: ListTodoIcon },
  { to: "/users", label: "Users", icon: UsersIcon },
];

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 px-4">
          <span className="mr-2 font-heading font-semibold text-xl">
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
          <div className="ml-2">
            <Clock />
          </div>
        </div>
        <Separator />
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
