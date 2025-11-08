import React from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationContext();

  return (
    <div className="fixed top-6 right-6 z-50 w-full max-w-sm">
      {notifications.map((n) => (
        <Notification key={n.id} {...n} onDismiss={() => removeNotification(n.id)} />
      ))}
    </div>
  );
}

export function Notification({ id, title, message, type, onDismiss }) {
  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  return (
    <div className="bg-white dark:bg-gray-950 shadow-lg border dark:border-gray-800 rounded-lg p-4 mb-4 flex items-start">
      <div className="flex-shrink-0">{icons[type]}</div>

      <div className="ml-3 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>

      <button
        onClick={onDismiss}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
