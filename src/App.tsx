import { Navigate, Route, Routes } from "react-router";

import { AppLayout } from "@/components/layout/app-layout";
import {
  GuestOnly,
  RequireAuth,
  RequireRole,
} from "@/features/auth/route-guards";
import { AccountPage } from "@/pages/account-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { SignInPage } from "@/pages/sign-in-page";
import { SignUpPage } from "@/pages/sign-up-page";
import { TodosPage } from "@/pages/todos-page";
import { UserDetailPage } from "@/pages/user-detail-page";
import { UsersPage } from "@/pages/users-page";

export function App() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/todos" replace />} />
          <Route path="todos" element={<TodosPage />} />
          <Route element={<RequireRole allow="admin" />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
          </Route>
          <Route path="account" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
