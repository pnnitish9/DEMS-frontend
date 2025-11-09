import React, { useState, useEffect, useRef } from "react";
import {
  List,
  Bell,
  Sun,
  Moon,
  Calendar,
  QrCode,
  Search,
  Check,
  Trash2,
} from "lucide-react";

import { useThemeContext } from "../context/ThemeContext";
import { useNotificationContext } from "../context/NotificationContext";
import { useAuthContext } from "../context/AuthContext";
import { usePageContext } from "../context/PageContext";

import UserProfileDropdown from "./UserProfileDropdown";

export default function Header({ openSidebar }) {
  const {
    unread,
    grouped,
    notifications,
    dropdownOpen,
    setDropdownOpen,
    markOneAsRead,
    markAllAsRead,
    deleteOne,
  } = useNotificationContext();

  const { isDarkMode, toggleTheme } = useThemeContext();
  const { currentUser } = useAuthContext();
  const { navigate, searchQuery, setSearchQuery } = usePageContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isParticipant = currentUser?.role === "participant";

  const dropdownRef = useRef(null);

  /* ✅ CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ✅ Helper: Open event when clicking notification */
  const openEvent = (n) => {
    if (n.eventId) navigate(`event/${n.eventId}`);
    setDropdownOpen(false);
  };

  return (
    <header className="h-20 bg-white dark:bg-gray-950 shadow border-b dark:border-gray-800 sticky top-0 z-40">
      <div className="px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        
        {/* ✅ LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            navigate(
              currentUser
                ? currentUser.role === "participant"
                  ? "participant-dashboard"
                  : currentUser.role === "organizer"
                  ? "organizer-dashboard"
                  : "admin-dashboard"
                : "landing"
            )
          }
        >
          <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        </div>

        {/* ✅ Sidebar Toggle */}
        {currentUser?.role !== "participant" && (
          <button onClick={openSidebar} className="lg:hidden">
            <List className="w-7 h-7" />
          </button>
        )}

        {/* ✅ Participant Nav */}
        {isParticipant && (
          <div className="hidden md:flex items-center gap-4 flex-1">
            <button
              onClick={() => navigate("participant-dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg 
              hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Calendar className="w-4 h-4" /> Browse Events
            </button>

            <button
              onClick={() => navigate("my-registrations")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg 
              hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <QrCode className="w-4 h-4" /> My Registrations
            </button>

            {/* Search bar */}
            <div className="flex items-center gap-2 flex-1 bg-gray-100 dark:bg-gray-800 border px-3 py-2 rounded-xl">
              <Search className="w-5 h-5" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="bg-transparent flex-1 outline-none"
              />
            </div>
          </div>
        )}

        {/* ✅ RIGHT SIDE */}
        <div className="flex items-center gap-3 ml-auto">

          {/* THEME */}
          <button onClick={toggleTheme} className="p-2 rounded-full">
            {isDarkMode ? <Sun /> : <Moon />}
          </button>

          {/* ✅ NOTIFICATION DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((v) => !v);
                markAllAsRead();
              }}
              className="p-2 rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bell className="w-6 h-6" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </button>

            {/* ✅ SLIDE-DOWN DROPDOWN */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 
                border dark:border-gray-700 rounded-xl shadow-xl p-3 z-50 
                animate-slideDown">
                
                <h3 className="font-medium text-sm mb-2">Notifications</h3>

                {/* ✅ Groups */}
                {["today", "yesterday", "earlier"].map((section) => (
                  grouped[section].length > 0 && (
                    <div key={section}>
                      <p className="text-xs text-gray-400 uppercase mb-1 mt-2">
                        {section === "today"
                          ? "Today"
                          : section === "yesterday"
                          ? "Yesterday"
                          : "Earlier"}
                      </p>

                      {grouped[section].map((n) => (
                        <div
                          key={n._id}
                          className="p-3 mb-2 bg-gray-50 dark:bg-gray-800 
                            rounded-lg border flex justify-between items-start 
                            cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onClick={() => openEvent(n)}
                        >
                          <div>
                            <p className="font-medium text-sm">{n.title}</p>
                            <p className="text-xs text-gray-400">{n.message}</p>
                          </div>

                          <div className="flex gap-2">
                            {!n.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markOneAsRead(n._id);
                                }}
                                className="text-green-500"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteOne(n._id);
                              }}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* PROFILE DROPDOWN */}
          <UserProfileDropdown direction="down" />

          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg"
          >
            <List className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
