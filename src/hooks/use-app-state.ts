import { useOutletContext } from "react-router";

import type { Account } from "@/features/account/types";
import type { TodosState } from "@/features/todos/use-todos";

// State lifted into AppLayout so it survives navigating between pages.
export type AppState = {
  todos: TodosState;
  account: Account;
  setAccount: (account: Account) => void;
};

export function useAppState() {
  return useOutletContext<AppState>();
}
