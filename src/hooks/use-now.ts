import { useEffect, useState } from "react";

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    // Cleanup: stop the timer on unmount or when intervalMs changes.
    return () => clearInterval(timer);
    // intervalMs is the only value the effect reads.
  }, [intervalMs]);

  return now;
}
