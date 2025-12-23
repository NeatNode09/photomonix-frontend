import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  login as loginFn,
  register as registerFn,
  logout as logoutFn,
  verifyEmail as verifyEmailFn,
  resendVerification,
  forgotPassword,
  resetPasswordWithToken,
  updateProfile as updateProfileApi,
  getProfile as getProfileFn,
  auth,
} from "~/services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPasswordWithToken: (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<boolean>;
  updateProfile: (updates: {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }) => Promise<boolean>;
  getProfile: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedUser = auth.getUser();
    if (storedUser && auth.isAuthenticated()) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginFn(email, password);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await registerFn(name, email, password);
      return response.success;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutFn();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      const response = await verifyEmailFn(token);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Email verification failed:", error);
      return false;
    }
  };

  const resendVerificationFn = async (email: string): Promise<boolean> => {
    try {
      const response = await resendVerification(email);
      return response.success;
    } catch (error) {
      console.error("Resend verification failed:", error);
      return false;
    }
  };

  const forgotPasswordFn = async (email: string): Promise<boolean> => {
    try {
      const response = await forgotPassword(email);
      return response.success;
    } catch (error) {
      console.error("Forgot password failed:", error);
      return false;
    }
  };

  const resetPasswordWithTokenFn = async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      const response = await resetPasswordWithToken(
        token,
        newPassword,
        confirmPassword
      );
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Password reset failed:", error);
      return false;
    }
  };

  const updateProfileFn = async (updates: {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }): Promise<boolean> => {
    try {
      const response = await updateProfileApi(updates);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Profile update failed:", error);
      return false;
    }
  };

  const getProfile = async (): Promise<boolean> => {
    try {
      const response = await getProfileFn();
      if (response.success && response.data?.profile) {
        setUser({
          id: response.data.profile.id,
          name: response.data.profile.name,
          email: response.data.profile.email,
          emailVerified: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Get profile failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        resendVerification: resendVerificationFn,
        forgotPassword: forgotPasswordFn,
        resetPasswordWithToken: resetPasswordWithTokenFn,
        updateProfile: updateProfileFn,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
