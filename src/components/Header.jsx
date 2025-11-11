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
  ChevronDown,
  User,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

import { useThemeContext } from "../context/ThemeContext";
import { useNotificationContext } from "../context/NotificationContext";
import { useAuthContext } from "../context/AuthContext";
import { usePageContext } from "../context/PageContext";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Header({ openSidebar }) {
  /* ---------- contexts ---------- */
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
  const { currentUser, logout } = useAuthContext();
  const { navigate, searchQuery, setSearchQuery } = usePageContext();

  /* ---------- local state ---------- */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false); // accordion section
  const isParticipant = currentUser?.role === "participant";

  /* ---------- dropdown outside click ---------- */
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setDropdownOpen]);

  /* ---------- open event from notification ---------- */
  const openEvent = (n) => {
    if (n.eventId) navigate(`event/${n.eventId}`);
    setDropdownOpen(false);
  };

  /* ---------- helpers ---------- */
  const goHomeByRole = () => {
    if (!currentUser) return navigate("landing");
    if (isParticipant) return navigate("participant-dashboard");
    if (currentUser.role === "organizer") return navigate("organizer-dashboard");
    return navigate("admin-dashboard");
  };

  return (
    <header className="h-20 bg-white dark:bg-gray-950 shadow border-b dark:border-gray-800 sticky top-0 z-40">
      <div className="px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={goHomeByRole}
        >
          <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        </div>

        {/* Sidebar Toggle (organizer/admin only) */}
        {currentUser?.role !== "participant" && (
          <button onClick={openSidebar} className="lg:hidden text-gray-700 dark:text-gray-300">
            <List className="w-7 h-7" />
          </button>
        )}

        {/* Participant Desktop Nav */}
        {isParticipant && (
          <div className="hidden md:flex items-center gap-4 flex-1">
            <button
              onClick={() => navigate("participant-dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Calendar className="w-4 h-4" /> Browse Events
            </button>

            <button
              onClick={() => navigate("my-registrations")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <QrCode className="w-4 h-4" /> My Registrations
            </button>

            {/* Search */}
            <div className="flex items-center gap-2 flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-xl">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="bg-transparent flex-1 outline-none text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((v) => !v);
                // mark as read on open
                if (!dropdownOpen && unread > 0) markAllAsRead();
              }}
              className="p-2 rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </button>

            {/* Dropdown Panel */}
            {dropdownOpen && (
              <div
                className="absolute right-7 -mr-20 mt-3 w-80 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-xl p-3 z-50 animate-slideDown"
                role="menu"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm">Notifications</h3>
                </div>

                {/* Groups */}
                {["today", "yesterday", "earlier"].map(
                  (section) =>
                    grouped[section].length > 0 && (
                      <div key={section}>
                        <p className="text-xs text-gray-400 uppercase mb-1 mt-2">
                          {section === "today"
                            ? "Today"
                            : section === "yesterday"
                            ? "Yesterday"
                            : "Earlier"}
                        </p>

                        <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
                          {grouped[section].map((n) => (
                            <div
                              key={n._id}
                              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition flex justify-between items-start"
                              onClick={() => openEvent(n)}
                            >
                              <div>
                                <p className="font-medium text-sm">{n.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {new Date(n.createdAt).toLocaleString()}
                                </p>
                              </div>

                              <div className="flex gap-2 ml-2">
                                {!n.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markOneAsRead(n._id);
                                    }}
                                    className="text-green-500 hover:text-green-600"
                                    aria-label="Mark as read"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteOne(n._id);
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                  aria-label="Delete notification"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                )}

                {/* Empty */}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-6">No notifications</p>
                )}
              </div>
            )}

          </div>

          {/* Desktop profile dropdown (unchanged) */}
          <div className="hidden md:block">
            <UserProfileDropdown direction="down" />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen((v) => !v);
              if (!mobileMenuOpen) setMobileProfileOpen(false); // reset section on open
            }}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <List className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ---------- MOBILE MENU (hamburger content) ---------- */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-4 py-5 space-y-4 rounded-b-2xl shadow-inner ${
            isParticipant ? "bg-indigo-50 dark:bg-indigo-900/30" : "bg-gray-100 dark:bg-gray-900"
          }`}
        >
          {/* Quick actions row */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => {
                goHomeByRole();
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow flex flex-col items-center hover:scale-[1.02] active:scale-[0.99] transition"
            >
              <Home className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] mt-1 text-gray-600 dark:text-gray-300">Home</span>
            </button>

            {isParticipant && (
              <button
                onClick={() => {
                  navigate("participant-dashboard");
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow flex flex-col items-center hover:scale-[1.02] active:scale-[0.99] transition"
              >
                <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] mt-1 text-gray-600 dark:text-gray-300">Browse</span>
              </button>
            )}

            {isParticipant && (
              <button
                onClick={() => {
                  navigate("my-registrations");
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow flex flex-col items-center hover:scale-[1.02] active:scale-[0.99] transition"
              >
                <QrCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] mt-1 text-gray-600 dark:text-gray-300">Passes</span>
              </button>
            )}

            {/* Notifications shortcut (mobile) */}
            <button
              onClick={() => {
                // open the top bell dropdown from header for consistency
                setDropdownOpen(true);
              }}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow flex flex-col items-center hover:scale-[1.02] active:scale-[0.99] transition"
            >
              <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] mt-1 text-gray-600 dark:text-gray-300">Alerts</span>
            </button>
          </div>

          {/* Search for participant */}
          {isParticipant && (
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-xl shadow-sm">
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

          {/* ---------- MOBILE PROFILE ACCORDION (Option C) ---------- */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {/* Trigger */}
            <button
              onClick={() => setMobileProfileOpen((v) => !v)}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-lg border dark:border-gray-700"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold">
                    {currentUser?.name || "Profile"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser?.role || "guest"}
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  mobileProfileOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Content (animated accordion) */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                mobileProfileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-2 py-2 space-y-1">
                  {/* View Profile */}
                  <button
                    onClick={() => {
                      navigate("profile");
                      setMobileMenuOpen(false);
                      setMobileProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => {
                      navigate("settings");
                      setMobileMenuOpen(false);
                      setMobileProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      logout?.();
                      navigate("landing");
                      setMobileMenuOpen(false);
                      setMobileProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-left text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Small helper text */}
          <p className="text-[11px] text-center text-gray-500 dark:text-gray-400 pt-1">
            Tip: Tap your name to open the profile menu.
          </p>
        </div>
      </div>
    </header>
  );
}

