import { Navigate, Route, Routes } from "react-router";

import { AppLayout } from "@/components/layout/app-layout";
import { AccountPage } from "@/pages/account-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { TodosPage } from "@/pages/todos-page";
import { UserDetailPage } from "@/pages/user-detail-page";
import { UsersPage } from "@/pages/users-page";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/todos" replace />} />
        <Route path="todos" element={<TodosPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
