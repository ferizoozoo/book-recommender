import { useAuthContext } from "@/contexts/auth-context";
import { useCallback } from "react";

export function useFetchWithAuth() {
  const auth = useAuthContext();

  const fetchWithInterceptor = useCallback(
    async (input: RequestInfo, init: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(init.headers || {});
      headers.set("Content-Type", "application/json");
      if (auth.accessToken) {
        headers.set("Authorization", `Bearer ${auth.accessToken}`);
      }

      const requestInit: RequestInit = {
        ...init,
        headers,
      };

      try {
        const response = await fetch(input, requestInit);
        if (response.status === 401) {
          auth.logout();
          return response;
        }
        return response;
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },
    [auth]
  );

  return fetchWithInterceptor;
}
