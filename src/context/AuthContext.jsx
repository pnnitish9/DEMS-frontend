import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ✅ Load user on app start */
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

  /* ✅ Login (no notification here) */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("demp-token", data.token);
      setCurrentUser(data);
      return { success: true, user: data };
    } catch (e) {
      return { success: false, message: e.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Register (no notification here) */
  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem("demp-token", data.token);
      setCurrentUser(data);
      return { success: true, user: data };
    } catch (e) {
      return { success: false, message: e.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Logout */
  const logout = () => {
    localStorage.removeItem("demp-token");
    setCurrentUser(null);
  };

  /* ✅ Update profile */
  const updateUser = async (name) => {
    try {
      const { data } = await api.put("/auth/profile", { name });
      setCurrentUser(data);
      return true;
    } catch {
      return false;
    }
  };

  /* ✅ Change password */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      return true;
    } catch {
      return false;
    }
  };

  /* ✅ Delete account */
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
        loading,
        login,
        register,
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
