"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";

interface User {
  _id: string;
  name?: string;
  fullname?: string;
  email: string;
  phone?: string;
  discount?: number;
  role?: string;
  isAdmin?: boolean;
  isApproved?: boolean;
  isActive?: boolean;
  address?: string;
  adminRoleId?: string;
  adminPermissions?: Record<string, any>;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  isActive: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setUserFromTokens: (token: string, refreshToken: string, user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const normalizeUser = (user: any): User => ({
  _id: user._id,
  fullname: user.fullname || user.name || "",
  email: user.email || "",
  phone: user.phone || "",
  discount: user.discount || 0,
  role: user.role || "user",
  isAdmin: user.role === "admin" || user.isAdmin || false,
  isApproved: user.isApproved || false,
  isActive: user.isActive !== false,
  address: user.address || "",
  adminRoleId: user.adminRoleId,
  adminPermissions: user.adminPermissions || {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage while the server verification runs
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token) {
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem("user");
          }
        }

        try {
          const response = await api.get("/auth/me");
          const user =
            response?.data?.data || response?.data?.user || response?.data;
          if (user && user._id) {
            const normalized = normalizeUser(user);
            localStorage.setItem("user", JSON.stringify(normalized));
            setCurrentUser(normalized);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setCurrentUser(null);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      // Admin OTP flow: just return the response so the page can show OTP
      if (response?.data?.success && response?.data?.requiresOTP) {
        return response.data;
      }

      const token =
        response?.data?.token ||
        response?.data?.data?.token ||
        response?.data?.data?.accessToken;
      const refreshToken =
        response?.data?.refreshToken || response?.data?.data?.refreshToken;
      const user =
        response?.data?.user ||
        response?.data?.data?.user ||
        response?.data?.data;

      if (!token) {
        throw new Error("No authentication token received");
      }

      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      const normalized = normalizeUser(user);
      localStorage.setItem("user", JSON.stringify(normalized));
      setCurrentUser(normalized);

      return { success: true, user: normalized };
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const setUserFromTokens = (
    token: string,
    refreshToken: string,
    user: any,
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    const normalized = normalizeUser(user);
    localStorage.setItem("user", JSON.stringify(normalized));
    setCurrentUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setCurrentUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      const user =
        response?.data?.data || response?.data?.user || response?.data;
      if (user && user._id) {
        const normalized = normalizeUser(user);
        localStorage.setItem("user", JSON.stringify(normalized));
        setCurrentUser(normalized);
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
      logout();
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin || false,
    isApproved: currentUser?.isApproved || false,
    isActive: currentUser?.isActive !== false,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    setUserFromTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
