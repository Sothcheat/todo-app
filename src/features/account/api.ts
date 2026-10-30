import { apiFetch } from "@/lib/api";
import type { Account } from "./types";

export function fetchProfile() {
  return apiFetch<Account>("/profile");
}

// Send only the editable fields: the API rejects unknown ones.
export function updateProfile({ name, username, email, bio }: Account) {
  return apiFetch<Account>("/profile", {
    method: "PATCH",
    body: JSON.stringify({ name, username, email, bio }),
  });
}
