import { apiFetch, setAccessToken } from "@/lib/api";

export type SignInInput = { email: string; password: string };
export type SignUpInput = SignInInput & { name: string; username: string };

// Both endpoints set the refresh cookie and return the access token.
async function authenticate(path: string, input: SignInInput | SignUpInput) {
  const { accessToken } = await apiFetch<{ accessToken: string }>(path, {
    method: "POST",
    body: JSON.stringify(input),
  });
  setAccessToken(accessToken);
}

export function signIn(input: SignInInput) {
  return authenticate("/auth/login", input);
}

export function signUp(input: SignUpInput) {
  return authenticate("/auth/register", input);
}

// Revokes the refresh token and clears its cookie.
export async function signOut() {
  try {
    await apiFetch<void>("/auth/logout", { method: "POST" });
  } finally {
    setAccessToken(null);
  }
}
