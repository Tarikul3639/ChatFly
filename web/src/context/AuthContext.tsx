"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<{ success: boolean; message: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      // Check localStorage for user data
      const storedUser = localStorage.getItem("chatfly-user");
      const storedToken = localStorage.getItem("chatfly-token");

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Set cookie for middleware
        document.cookie = `chatfly-token=${storedToken}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`; // 7 days
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid data
      localStorage.removeItem("chatfly-user");
      localStorage.removeItem("chatfly-token");
      document.cookie =
        "chatfly-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } finally {
      setIsLoading(false);
    }
  };

  interface ILoginResponseUser {
    id: string;
    email: string;
    username: string;
  }
  interface ILoginResponse {
    success: boolean;
    message: string;
    data: {
      token: string;
      user: ILoginResponseUser;
    };
  }

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      // Call backend login route
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { email, password }
      );

      // Type the response according to backend
      const data = response.data as ILoginResponse;

      if (response.status === 200 && data.success) {
        const { user, token } = data.data;

        if (rememberMe) {
          // Store in localStorage
          localStorage.setItem("chatfly-user", JSON.stringify(user));
          localStorage.setItem("chatfly-token", token);
        } else {
          // Store in sessionStorage
          sessionStorage.setItem("chatfly-user", JSON.stringify(user));
          sessionStorage.setItem("chatfly-token", token);
        }

        // Set cookie for middleware (optional)
        document.cookie = `chatfly-token=${token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }; Secure; SameSite=Strict`;

        // Update React state
        setUser(user);
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message };
    } catch (error: unknown) {
      console.error((error as any)?.response?.data?.message);
      return {
        success: false,
        message: (error as any)?.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  interface ISignupResponse {
    success: boolean;
    message: string;
  }
  // Sign up a new user
  const signup = async (
    email: string,
    password: string,
    username: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      // Call backend signup route
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        { email, password, username }
      );
      // Type the response according to backend
      const data = response.data as ISignupResponse;

      if (response.status === 201 && data.success) {

        return { success: true, message: data.message };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error((error as any)?.response?.data?.message);
      return { success: false, message: (error as any)?.response?.data?.message || "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("chatfly-user");
    localStorage.removeItem("chatfly-token");

    // Clear cookie
    document.cookie =
      "chatfly-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setUser(null);
    router.push("/auth/login");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
