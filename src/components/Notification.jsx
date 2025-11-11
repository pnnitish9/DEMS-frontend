import React from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";

export function NotificationContainer() {
  const { toastList, removeToast } = useNotificationContext();

  return (
    <div
      className="
        fixed top-4 right-4 sm:top-6 sm:right-6 z-50 
        w-[90%] sm:w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
        space-y-3
      "
    >
      {toastList.map((n) => (
        <ToastNotification
          key={n.id}
          {...n}
          onDismiss={() => removeToast(n.id)}
        />
      ))}
    </div>
  );
}

export function ToastNotification({ id, title, message, type, onDismiss }) {
  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  return (
    <div
      className="
        bg-white dark:bg-gray-900 shadow-lg border dark:border-gray-800 
        rounded-lg p-3 sm:p-4 flex items-start animate-slide-in
        transition-all duration-300 ease-in-out
        w-full break-words
      "
    >
      <div className="flex-shrink-0">{icons[type]}</div>

      <div className="ml-2 sm:ml-3 flex-1">
        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
          {title}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
          {message}
        </p>
      </div>

      <button
        onClick={onDismiss}
        className="
          ml-3 sm:ml-4 text-gray-400 hover:text-gray-600 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 
          rounded-full transition
        "
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
