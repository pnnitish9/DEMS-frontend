import { useState, useEffect } from "react";
import { api } from "../api/api";

export default function useAuth(notify) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // Admin only

  // ✅ On initial render → check token
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("demp-token");
      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const { data: user } = await api.get("/auth/profile");
        setCurrentUser(user);

        if (user.role === "admin") {
          const { data: allUsers } = await api.get("/admin/users");
          setUsers(allUsers);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("demp-token");
      }

      setAuthReady(true);
    })();
  }, []);

  // ✅ Authentication actions
  const authActions = {
    login: async (email, password) => {
      setLoading(true);
      try {
        const { data } = await api.post("/auth/login", { email, password });

        localStorage.setItem("demp-token", data.token);
        setCurrentUser(data);

        notify?.("Login Successful", `Welcome back, ${data.name}!`);

        if (data.role === "admin") {
          const { data: allUsers } = await api.get("/admin/users");
          setUsers(allUsers);
        }

        return true;
      } catch (error) {
        notify?.(
          "Login Failed",
          error.response?.data?.message || "Invalid credentials",
          "error"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },

    logout: () => {
      localStorage.removeItem("demp-token");
      setCurrentUser(null);
      setUsers([]);
    },

    register: async (name, email, password, role) => {
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

        notify?.("Registration Successful", "Welcome to DEMP!");

        return true;
      } catch (error) {
        notify?.(
          "Registration Failed",
          error.response?.data?.message || "Try again",
          "error"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },

    updateUser: async (name) => {
      try {
        const { data } = await api.put("/auth/profile", { name });

        setCurrentUser(data);

        // Update admin users array
        setUsers((prev) => prev.map((u) => (u._id === data._id ? data : u)));

        return true;
      } catch (error) {
        return false;
      }
    },

    changePassword: async (currentPassword, newPassword) => {
      try {
        await api.put("/auth/password", { currentPassword, newPassword });
        return true;
      } catch (error) {
        return false;
      }
    },

    deleteAccount: async (password) => {
      try {
        await api.delete("/auth/account", { data: { password } });
        authActions.logout();
        return true;
      } catch (error) {
        return false;
      }
    },
  };

  return {
    authActions,
    currentUser,
    authReady,
    users,
    loading,
  };
}
