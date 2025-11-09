import React from "react";
import {
  List,
  Bell,
  Sun,
  Moon,
  Calendar,
  QrCode,
  Search,
} from "lucide-react";

import { useThemeContext } from "../context/ThemeContext";
import { useNotificationContext } from "../context/NotificationContext";
import { useAuthContext } from "../context/AuthContext";
import { usePageContext } from "../context/PageContext";

import UserProfileDropdown from "./UserProfileDropdown";

export default function Header({ openSidebar }) {
  const { notifications } = useNotificationContext();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { currentUser } = useAuthContext();
  const { navigate, searchQuery, setSearchQuery } = usePageContext();

  const isParticipant = currentUser?.role === "participant";

  return (
    <header className="h-20 bg-white dark:bg-gray-950 shadow border-b dark:border-gray-800 sticky top-0 z-40">
      <div className="px-6 h-full flex items-center justify-between gap-4">

        {/* ✅ LOGO — Added (does not change anything else) */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            navigate(currentUser ? "participant-dashboard" : "landing")
          }
        >
          <img
            src="/logo.png"          // ✅ Put your logo in public/logo.png
            alt="Logo"
            className="w-13 h-12 object-cover rounded-lg"
          />
        </div>

        {/* ✅ SIDEBAR BUTTON (NOT FOR PARTICIPANT) */}
        {currentUser?.role !== "participant" && (
          <button
            onClick={openSidebar}
            className="lg:hidden text-gray-700 dark:text-gray-300"
          >
            <List className="w-6 h-6" />
          </button>
        )}

        {/* ✅ PARTICIPANT NAVIGATION + SEARCH */}
        {isParticipant && (
          <div className="flex items-center gap-4 flex-1">

            {/* Browse Events */}
            <button
              onClick={() => navigate("participant-dashboard")}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg 
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Calendar className="w-4 h-4" />
              <span>Browse Events</span>
            </button>

            {/* My Registrations */}
            <button
              onClick={() => navigate("my-registrations")}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg 
              text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <QrCode className="w-4 h-4" />
              <span>My Registrations</span>
            </button>

            {/* ✅ SEARCH BAR */}
            <div
              className="
                flex items-center gap-2 flex-1
                bg-gray-100 dark:bg-gray-800
                border border-gray-300 dark:border-gray-700
                px-3 py-2 rounded-xl shadow-sm
              "
            >
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />

              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full bg-transparent outline-none
                  text-gray-700 dark:text-gray-200
                "
              />
            </div>
          </div>
        )}

        {/* ✅ RIGHT SIDE CONTROLS */}
        <div className="flex items-center gap-4 ml-auto">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
            <Bell className="w-5 h-5" />

            {notifications.length > 0 && (
              <span
                className="
                  absolute -top-1 -right-1 
                  bg-red-500 text-white text-[10px] 
                  px-1.5 py-0.5 rounded-full
                "
              >
                {notifications.length}
              </span>
            )}
          </button>

          {/* PROFILE DROPDOWN */}
          <UserProfileDropdown direction="down" />
        </div>
      </div>
    </header>
  );
}
