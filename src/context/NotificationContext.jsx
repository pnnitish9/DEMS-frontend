import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();
export const useNotificationContext = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // ✅ Add a notification
  const addNotification = useCallback((title, message, type = "success") => {
    const id = Date.now();

    setNotifications((prev) => [
      ...prev,
      { id, title, message, type }
    ]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  // ✅ Remove notification manually
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
