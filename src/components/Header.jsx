import React, { useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12 "
          />
        </div>

        {/* ✅ SIDEBAR (only for organizer/admin, not participant) */}
        {currentUser?.role !== "participant" && (
          <button
            onClick={openSidebar}
            className="lg:hidden text-gray-700 dark:text-gray-300"
          >
            <List className="w-7 h-7" />
          </button>
        )}

        {/* ✅ PARTICIPANT NAVIGATION (Desktop only) */}
        {isParticipant && (
          <div className="hidden md:flex items-center gap-4 flex-1">

            <button
              onClick={() => navigate("participant-dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg 
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Calendar className="w-4 h-4" />
              <span>Browse Events</span>
            </button>

            <button
              onClick={() => navigate("my-registrations")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg 
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
        <div className="flex items-center gap-3 ml-auto">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white 
                           text-[10px] px-1.5 py-0.5 rounded-full"
              >
                {notifications.length}
              </span>
            )}
          </button>

          {/* Profile */}
          <UserProfileDropdown direction="down" />

          {/* ✅ MOBILE MENU TOGGLE — Only one button for all roles */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <List className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ✅ MOBILE MENU (Slide-down) */}
      {mobileMenuOpen && (
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-out
            ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div
            className={`
              px-4 py-5 space-y-4
              rounded-b-2xl shadow-inner
              ${isParticipant
                ? "bg-indigo-50 dark:bg-indigo-900/30"
                : "bg-gray-100 dark:bg-gray-900"}
            `}
          >

            {/* ✅ ICON QUICK MENU */}
            <div className="flex items-center justify-around">

              {/* Home */}
              <button
                onClick={() => {
                  navigate(
                    isParticipant
                      ? "participant-dashboard"
                      : currentUser.role === "organizer"
                      ? "organizer-dashboard"
                      : "admin-dashboard"
                  );
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center hover:scale-105 transition"
              >
                <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] mt-1 text-gray-500 dark:text-gray-300">
                  Home
                </span>
              </button>

              {/* My Registrations (Participant only) */}
              {isParticipant && (
                <button
                  onClick={() => {
                    navigate("my-registrations");
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center hover:scale-105 transition"
                >
                  <QrCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[10px] mt-1 text-gray-500 dark:text-gray-300">
                    Passes
                  </span>
                </button>
              )}

              {/* Alerts */}
              <button className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center hover:scale-105 transition">
                <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] mt-1 text-gray-500 dark:text-gray-300">
                  Alerts
                </span>
              </button>

              {/* Profile */}
              <button
                onClick={() => {
                  navigate("profile");
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col items-center hover:scale-105 transition"
              >
                <img src="/logo.png" className="w-6 h-6 rounded-full" />
                <span className="text-[10px] mt-1 text-gray-500 dark:text-gray-300">
                  Profile
                </span>
              </button>
            </div>

            {/* ✅ SEARCH FOR PARTICIPANT */}
            {isParticipant && (
              <div
                className="
                  flex items-center gap-2
                  bg-white dark:bg-gray-800
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
                  className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
