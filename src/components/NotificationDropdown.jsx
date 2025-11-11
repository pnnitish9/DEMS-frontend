import React, { useEffect, useRef } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";
import { usePageContext } from "../context/PageContext";

// ✅ Slide-down animation class
const animClass =
  "transition-all duration-300 ease-out transform opacity-100 translate-y-0";

export default function NotificationDropdown() {
  const {
    grouped,
    unread,
    dropdownOpen,
    setDropdownOpen,
    markAllAsRead,
    markOneAsRead,
    deleteOne,
    notifications,
  } = useNotificationContext();

  const { navigate } = usePageContext();

  const panelRef = useRef(null);

  // ✅ Close when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const openEvent = (n) => {
    if (n.eventId) {
      navigate(`event/${n.eventId}`);
      setDropdownOpen(false);
    }
  };

  const sectionTitle = {
    today: "Today",
    yesterday: "Yesterday",
    earlier: "Earlier",
  };

  return (
    <div className="relative select-none">
      {/* ✅ Bell Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
          if (unread > 0) markAllAsRead();
        }}
        className="
          p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
          relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
        "
      >
        <Bell className="w-6 h-6" />
        {unread > 0 && (
          <span
            className="
              absolute -top-1 -right-1 bg-red-500 text-white 
              text-[10px] px-1.5 py-0.5 rounded-full
            "
          >
            {unread}
          </span>
        )}
      </button>

      {/* ✅ Dropdown Panel */}
      {dropdownOpen && (
        <div
          ref={panelRef}
          className="
            absolute right-2 sm:right-0 mt-3 w-[90vw] sm:w-80 md:w-96 
            max-w-sm sm:max-w-md md:max-w-lg 
            bg-white dark:bg-gray-900
            border dark:border-gray-700
            rounded-xl shadow-xl z-50 p-3 sm:p-4
            animate-fade-slide 
            max-h-[75vh] overflow-y-auto
          "
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm sm:text-base font-medium">Notifications</h3>

            {notifications.length > 0 && (
              <button
                onClick={() => notifications.forEach((n) => deleteOne(n._id))}
                className="
                  text-xs sm:text-sm text-red-600 dark:text-red-400 
                  hover:underline flex items-center gap-1
                "
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Clear all
              </button>
            )}
          </div>

          {/* Empty State */}
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 text-sm sm:text-base py-6">
              No notifications
            </p>
          ) : (
            <div className="space-y-4 pr-1">
              {/* ✅ Render Groups */}
              {["today", "yesterday", "earlier"].map(
                (group) =>
                  grouped[group].length > 0 && (
                    <div key={group}>
                      <p className="text-xs sm:text-sm text-gray-400 uppercase mb-1">
                        {sectionTitle[group]}
                      </p>

                      {grouped[group].map((n) => (
                        <div
                          key={n._id}
                          onClick={() => openEvent(n)}
                          className={`
                            p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800 
                            border border-gray-200 dark:border-gray-700
                            cursor-pointer hover:bg-gray-100 
                            dark:hover:bg-gray-700 
                            opacity-0 -translate-y-2 ${animClass}
                            transition-all duration-200 ease-in-out
                          `}
                        >
                          <div className="flex justify-between items-start gap-2 sm:gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-sm sm:text-base truncate">
                                {n.title}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                                {n.message}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              {/* ✅ Mark One Read */}
                              {!n.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markOneAsRead(n._id);
                                  }}
                                  className="
                                    text-green-500 hover:text-green-600 
                                    focus:outline-none
                                  "
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}

                              {/* ✅ Delete One */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteOne(n._id);
                                }}
                                className="
                                  text-red-500 hover:text-red-600 
                                  focus:outline-none
                                "
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
