import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { makeSocket } from "../lib/socket";
import { api } from "../api/api";
import { useAuthContext } from "./AuthContext";

const NotificationContext = createContext(null);
export const useNotificationContext = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const { currentUser } = useAuthContext();
  const token = useMemo(() => localStorage.getItem("demp-token") || "", [currentUser]);

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const socketRef = useRef(null);

  // ✅ Group notifications into Today / Yesterday / Earlier
  const grouped = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    const g = { today: [], yesterday: [], earlier: [] };

    notifications.forEach((n) => {
      const d = new Date(n.createdAt);
      if (isSameDay(d, today)) g.today.push(n);
      else if (isSameDay(d, yesterday)) g.yesterday.push(n);
      else g.earlier.push(n);
    });

    return g;
  }, [notifications]);

  const refresh = async () => {
    try {
      const [listRes, unreadRes] = await Promise.all([
        api.get("/notifications/my"),
        api.get("/notifications/unread-count"),
      ]);
      setNotifications(listRes.data || []);
      setUnread(unreadRes.data?.count ?? 0);
    } catch {}
  };

  const markOneAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnread((c) => Math.max(0, c - 1));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch {}
  };

  const deleteOne = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  };

  // ✅ Live WebSocket listener
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (!token) {
      setNotifications([]);
      setUnread(0);
      return;
    }

    refresh();

    const s = makeSocket(token);
    socketRef.current = s;

    s.on("connect", () => console.log("✅ socket connected"));

    s.on("notification:new", (doc) => {
      setNotifications((prev) => [doc, ...prev]);
      setUnread((c) => c + 1);
    });

    return () => {
      s.disconnect();
    };
  }, [token]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unread,
        grouped,
        dropdownOpen,
        setDropdownOpen,
        markOneAsRead,
        markAllAsRead,
        deleteOne,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
