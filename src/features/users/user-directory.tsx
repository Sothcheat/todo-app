import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchUsers } from "./api";
import type { User } from "./types";
import { UserEmpty, UserError, UserList, UserListSkeleton } from "./user-views";

export function UserDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderContent = () => {
    if (loading) return <UserListSkeleton />;
    if (error) return <UserError message={error} />;
    if (users.length === 0) return <UserEmpty />;
    return <UserList users={users} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User directory</CardTitle>
        <CardDescription>
          {users.length > 0
            ? `${users.length} ${users.length === 1 ? "person" : "people"} — select someone to view their profile.`
            : "Everyone with an account."}
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
