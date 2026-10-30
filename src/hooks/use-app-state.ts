import { useOutletContext } from "react-router";

import type { TodosState } from "@/features/todos/use-todos";

// State lifted into AppLayout so it survives navigating between pages.
// The signed-in account lives in AuthProvider (useAccount / useAuth).
export type AppState = {
  todos: TodosState;
};

export function useAppState() {
  return useOutletContext<AppState>();
}
