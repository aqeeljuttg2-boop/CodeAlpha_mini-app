import React, { createContext, useContext, useState, useEffect } from "react";
import { CurrentUser } from "../types";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

interface AuthContextType {
  user: CurrentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (fullName: string, username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<CurrentUser>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Bootstrap user from stored token
  useEffect(() => {
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      authService
        .getCurrentUser()
        .then((res) => {
          setUser(res);
        })
        .catch(() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // LOGIN
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);

      setUser(res.user);
      setToken(res.token);

      if (rememberMe) {
        localStorage.setItem("token", res.token);
      } else {
        sessionStorage.setItem("token", res.token);
      }

      return true;
    } catch (err) {
      console.error("Login error", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (fullName: string, username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.register(fullName, username, email, password);

      setUser(res.user);
      setToken(res.token);

      localStorage.setItem("token", res.token);

      return true;
    } catch (err) {
      console.error("Registration error", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (profileData: Partial<CurrentUser>) => {
    try {
      const updated = await userService.updateProfile(profileData);
      setUser(updated);
      return true;
    } catch (err) {
      console.error("Profile update error", err);
      return false;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
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