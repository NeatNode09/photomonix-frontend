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
  resetPassword,
  changePassword as changePasswordFn,
  googleLogin,
  updateProfile as updateProfileApi,
  getProfile as getProfileFn,
  auth,
} from "@services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string;
  tokensRemaining: number;
  tokensUsed: number;
  oauthProvider?: string;
  googleId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleToken: (
    idToken: string
  ) => Promise<{ success: boolean; message?: string }>;
  verifyEmail: (
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
  resendVerification: (
    email: string
  ) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message?: string }>;
  resetPasswordWithToken: (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message?: string }>;
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

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await loginFn(email, password);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await registerFn(name, email, password);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        message: "An error occurred during registration",
      };
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

  const verifyEmail = async (
    token: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await verifyEmailFn(token);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error("Email verification failed:", error);
      return {
        success: false,
        message: "An error occurred during verification",
      };
    }
  };

  const resendVerificationFn = async (
    email: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await resendVerification(email);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error("Resend verification failed:", error);
      return { success: false, message: "An error occurred" };
    }
  };

  const forgotPasswordFn = async (
    email: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await forgotPassword(email);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error("Forgot password failed:", error);
      return { success: false, message: "An error occurred" };
    }
  };

  const resetPasswordWithTokenFn = async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      // Client-side validation for password confirmation
      if (newPassword !== confirmPassword) {
        return { success: false, message: "Passwords do not match" };
      }
      const response = await resetPassword(token, newPassword);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error("Password reset failed:", error);
      return { success: false, message: "An error occurred" };
    }
  };

  const changePasswordMethod = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await changePasswordFn(currentPassword, newPassword);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error("Password change failed:", error);
      return { success: false, message: "An error occurred" };
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
          tokensRemaining: 0,
          tokensUsed: 0,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Get profile failed:", error);
      return false;
    }
  };

  const loginWithGoogleToken = async (
    idToken: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await googleLogin(idToken);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, message: response.message };
      }
      return {
        success: false,
        message: response.message || "Google login failed",
      };
    } catch (error) {
      console.error("Google login failed:", error);
      return {
        success: false,
        message: "An error occurred during Google login",
      };
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    // TODO: Implement Google Sign-In library integration
    // For now, keep the redirect approach as a fallback
    // Once Google library is integrated:
    // 1. Initialize Google Sign-In
    // 2. Get ID token from Google
    // 3. Call googleLogin(idToken)
    // 4. Set user state

    window.location.href = "https://api.photomonix.pro/api/auth/google";
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
        loginWithGoogle,
        loginWithGoogleToken,
        verifyEmail,
        resendVerification: resendVerificationFn,
        forgotPassword: forgotPasswordFn,
        resetPasswordWithToken: resetPasswordWithTokenFn,
        changePassword: changePasswordMethod,
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
