// Shared fetch client for the NestJS todo-api (../../nestjs/todo-api).
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// The access token lives in memory only. After a page reload it's gone, and
// the httpOnly refresh cookie (which JavaScript can't read) gets a new one.
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

// Called when a request is rejected and the session can't be refreshed.
let onSessionExpired = () => {};

export function setOnSessionExpired(callback: () => void) {
  onSessionExpired = callback;
}

function send(path: string, init?: RequestInit) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    // Sends and stores the refresh cookie on this cross-origin request.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...init?.headers,
    },
  });
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // Nest errors look like { statusCode, message, error }; message can be an array from ValidationPipe.
    const body = await res.json().catch(() => null);
    const message = body?.message ?? `HTTP ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }
  // 204 No Content has no body to parse.
  return res.status === 204 ? (undefined as T) : res.json();
}

// Each refresh token works once, and the API logs the user out everywhere if
// one is reused. So concurrent callers (StrictMode's double effects, several
// requests hitting 401 together) share a single refresh request.
let refreshing: Promise<boolean> | null = null;

export function refreshSession() {
  refreshing ??= (async () => {
    try {
      const res = await send("/auth/refresh", { method: "POST" });
      if (!res.ok) {
        accessToken = null;
        return false;
      }
      const { accessToken: token } = await res.json();
      accessToken = token;
      return true;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

// Access tokens expire after 15 minutes: on a 401, refresh once and retry.
export async function apiFetch<T>(path: string, init?: RequestInit) {
  let res = await send(path, init);
  if (res.status === 401 && !path.startsWith("/auth/")) {
    if (await refreshSession()) res = await send(path, init);
    else onSessionExpired();
  }
  return parse<T>(res);
}
