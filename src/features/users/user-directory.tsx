import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { USERS_API, type User } from "./types";
import { UserEmpty, UserError, UserList, UserListSkeleton } from "./user-views";

export function UserDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      try {
        const res = await fetch(USERS_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: User[] = await res.json();
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
    fetchUsers();

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
            : "Browse everyone in the directory."}
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
