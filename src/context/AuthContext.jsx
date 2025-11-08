import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";
import { useNotificationContext } from "./NotificationContext";

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
  const { addNotification } = useNotificationContext();

  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ expose to pages

  // Load user from token on boot
  useEffect(() => {
    const token = localStorage.getItem("demp-token");
    if (!token) {
      setAuthReady(true);
      return;
    }
    api
      .get("/auth/profile")
      .then((res) => setCurrentUser(res.data))
      .catch(() => localStorage.removeItem("demp-token"))
      .finally(() => setAuthReady(true));
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("demp-token", data.token);
      setCurrentUser(data);
      addNotification?.("Welcome back!", `Logged in as ${data.name}`, "success");
      return true;
    } catch (e) {
      addNotification?.("Login failed", e.response?.data?.message || "Invalid credentials", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ match RegisterPage usage: register(name, email, password, role)
  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password, role });
      localStorage.setItem("demp-token", data.token);
      setCurrentUser(data);
      addNotification?.("Account created", "Welcome to DEMP!", "success");
      return true;
    } catch (e) {
      addNotification?.("Registration failed", e.response?.data?.message || "Please try again", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("demp-token");
    setCurrentUser(null);
  };

  const updateUser = async (name) => {
    try {
      const { data } = await api.put("/auth/profile", { name });
      setCurrentUser(data);
      return true;
    } catch {
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      return true;
    } catch {
      return false;
    }
  };

  const deleteAccount = async (password) => {
    try {
      await api.delete("/auth/account", { data: { password } });
      logout();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authReady,
        loading,         // ✅ now available
        login,
        register,        // ✅ fixed signature
        logout,
        updateUser,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
