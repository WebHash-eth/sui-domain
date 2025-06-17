import { useMemo } from "react";

export function useQueryParam(key: string): string | null {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }, [key]);
}
