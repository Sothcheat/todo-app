// "admin" can manage every user and todo; "user" only their own.
export type Role = "user" | "admin";

// The fields of GET /profile the app uses.
export type Account = {
  userId: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  role: Role;
};
