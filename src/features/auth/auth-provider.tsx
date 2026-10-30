import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { fetchProfile, updateProfile } from "@/features/account/api";
import type { Account } from "@/features/account/types";
import { refreshSession, setOnSessionExpired } from "@/lib/api";
import * as authApi from "./api";

type AuthState = {
  // null while signed out.
  account: Account | null;
  // True until we know whether the refresh cookie still holds a session.
  loading: boolean;
  signIn: (input: authApi.SignInInput) => Promise<void>;
  signUp: (input: authApi.SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  saveAccount: (account: Account) => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  // On page load, trade the refresh cookie (if any) for an access token.
  useEffect(() => {
    setOnSessionExpired(() => setAccount(null));

    let cancelled = false;
    const restoreSession = async () => {
      try {
        if (await refreshSession()) {
          const profile = await fetchProfile();
          if (!cancelled) setAccount(profile);
        }
      } catch {
        // API unreachable: start signed out; the sign-in form will show the error.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (input: authApi.SignInInput) => {
    await authApi.signIn(input);
    setAccount(await fetchProfile());
  };

  const signUp = async (input: authApi.SignUpInput) => {
    await authApi.signUp(input);
    setAccount(await fetchProfile());
  };

  // Sign out locally even if the request fails.
  const signOut = async () => {
    try {
      await authApi.signOut();
    } finally {
      setAccount(null);
    }
  };

  const saveAccount = async (next: Account) => {
    setAccount(await updateProfile(next));
  };

  return (
    <AuthContext.Provider
      value={{ account, loading, signIn, signUp, signOut, saveAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

// For pages behind <RequireAuth>, where there is always an account.
export function useAccount() {
  const { account } = useAuth();
  if (!account) throw new Error("useAccount needs a signed-in user");
  return account;
}
