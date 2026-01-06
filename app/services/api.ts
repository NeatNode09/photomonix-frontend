const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      oauthProvider?: string;
      googleId?: string;
      profilePicture?: string;
    };
    profile?: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
    };
  };
  error?: string;
  requiresVerification?: boolean;
}

const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

const clearTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
};

const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

const request = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<AuthResponse> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && token) {
    const refreshed = await refreshTokenFn();
    if (refreshed) {
      const newToken = getAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });
      }
    }
  }

  return response.json();
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.data?.accessToken) {
    setAccessToken(response.data.accessToken);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }

  return response;
};

export const logout = async (): Promise<AuthResponse> => {
  const response = await request("/logout", {
    method: "POST",
  });

  if (response.success) {
    clearTokens();
  }

  return response;
};

export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  const response = await request("/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });

  if (response.success && response.data?.accessToken) {
    setAccessToken(response.data.accessToken);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }

  return response;
};

export const resendVerification = async (
  email: string
): Promise<AuthResponse> => {
  return request("/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  return request("/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPasswordWithToken = async (
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<AuthResponse> => {
  const response = await request("/reset-password-with-token", {
    method: "POST",
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });

  if (response.success && response.data?.accessToken) {
    setAccessToken(response.data.accessToken);
  }

  return response;
};

export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<AuthResponse> => {
  return request("/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, newPassword }),
  });
};

export const getProfile = async (): Promise<AuthResponse> => {
  return request("/profile", {
    method: "GET",
  });
};

export const updateProfile = async (updates: {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}): Promise<AuthResponse> => {
  const response = await request("/update-profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  if (response.success && response.data?.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response;
};

const refreshTokenFn = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    const data = (await response.json()) as AuthResponse;
    if (data.success && data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
      return true;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
  return false;
};

export const refreshToken = refreshTokenFn;

export const auth = {
  getAccessToken,
  setAccessToken,
  clearTokens,
  getUser,
  isAuthenticated,
  refreshToken,
};
