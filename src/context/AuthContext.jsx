import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const register = async (email, password, name, role = "patient") => {
    try {
      setError(null);
      const response = await authAPI.register({
        email,
        password,
        name,
        role,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
