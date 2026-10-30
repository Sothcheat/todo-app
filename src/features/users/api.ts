import type { Role } from "@/features/account/types";
import { apiFetch } from "@/lib/api";
import type { User } from "./types";

type ApiUser = Omit<User, "name" | "bio"> & {
  profile: { name: string; bio: string };
};

// These endpoints are admin only; anyone else gets 403.
export async function fetchUsers() {
  const users = await apiFetch<ApiUser[]>("/users");
  return users.map(
    ({ profile, ...user }): User => ({
      ...user,
      name: profile.name,
      bio: profile.bio,
    }),
  );
}

// The API won't let an admin change their own role or delete themselves.
export async function updateUserRole(id: string, role: Role) {
  await apiFetch(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

// Their profile, todos and sessions are deleted with them.
export function deleteUser(id: string) {
  return apiFetch<void>(`/users/${id}`, { method: "DELETE" });
}
