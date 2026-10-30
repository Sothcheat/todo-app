import type { Role } from "@/features/account/types";

// A row of GET /users (admin only), flattened: name and bio come from its profile.
export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  role: Role;
  createdAt: string;
};
