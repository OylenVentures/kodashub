import { useAuthStore } from "../store/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

let refreshPromise: Promise<string | null> | null = null;

const isPublicEndpoint = (endpoint: string) => endpoint.startsWith("auth/");

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = useAuthStore
      .getState()
      .refreshToken()
      .then((result) => {
        if (result.error || !result.accessToken) {
          return null;
        }
        return result.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const redirectToLogin = () => {
  useAuthStore.getState().setAccessToken(null);
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
};

const getValidAccessToken = async (): Promise<string | null> => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    return token;
  }

  try {
    const newToken = await refreshAccessToken();
    return newToken;
  } catch {
    redirectToLogin();
    return null;
  }
};

const apiHandler = async (endpoint: string, method: string, body?: unknown) => {
  try {
    const publicEndpoint = isPublicEndpoint(endpoint);
    let accessToken = publicEndpoint ? null : await getValidAccessToken();
    if (!publicEndpoint && !accessToken) {
      return { statusCode: 401, error: "Unauthorized access." };
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    let response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    // If a protected endpoint returns 401, attempt one token refresh and retry
    if (response.status === 401 && !publicEndpoint) {
      try {
        accessToken = await refreshAccessToken();
        if (!accessToken) throw new Error("Session expired");
        console.log("Token refreshed successfully", accessToken);

        headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          credentials: "include",
        });
      } catch {
        redirectToLogin();
        return { statusCode: response.status, error: "Unauthorized access." };
      }
    }

    // If still 401 after retry, the session is truly expired
    if (response.status === 401) {
      redirectToLogin();
      return { statusCode: response.status, error: "Unauthorized access." };
    }

    return { statusCode: response.status, ...(await response.json()) };
  } catch (error: unknown) {
    return {
      statusCode: error instanceof Response ? error.status : 500,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
};

export default apiHandler;
