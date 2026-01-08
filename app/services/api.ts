const API_BASE_URL = "https://api.photomonix.pro/api";

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
      avatarUrl?: string;
      tokensRemaining: number;
      tokensUsed: number;
      oauthProvider?: string;
      googleId?: string;
    };
    tokens?: {
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    };
    isNewUser?: boolean;
    profile?: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
    };
  };
  error?: string;
  errors?: Array<{ field: string; message: string }>;
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

const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

const setRefreshToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("refreshToken", token);
  }
};

const clearTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.data?.tokens) {
    setAccessToken(response.data.tokens.accessToken);
    setRefreshToken(response.data.tokens.refreshToken);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }

  return response;
};

export const logout = async (): Promise<AuthResponse> => {
  const refreshToken = getRefreshToken();
  const response = await request("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (response.success) {
    clearTokens();
  }

  return response;
};

export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  const response = await request(
    `/auth/verify-email?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
    }
  );

  return response;
};

export const resendVerification = async (
  email: string
): Promise<AuthResponse> => {
  return request("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<AuthResponse> => {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
};

export const googleLogin = async (idToken: string): Promise<AuthResponse> => {
  const response = await request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });

  if (response.success && response.data?.tokens) {
    setAccessToken(response.data.tokens.accessToken);
    setRefreshToken(response.data.tokens.refreshToken);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }

  return response;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<AuthResponse> => {
  return request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
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
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
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
  getRefreshToken,
  setRefreshToken,
  clearTokens,
  getUser,
  isAuthenticated,
  refreshToken,
};
