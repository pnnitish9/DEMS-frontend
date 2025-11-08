import React from "react";
import { List, Bell, Sun, Moon } from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Header({ openSidebar }) {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <header className="h-20 bg-white dark:bg-gray-950 shadow border-b dark:border-gray-800 sticky top-0 z-10">
      <div className="px-6 h-full flex items-center justify-between lg:justify-end">
        
        {/* ✅ Mobile Menu Button (now works) */}
        <button
          onClick={openSidebar}
          className="lg:hidden text-gray-700 dark:text-gray-300"
        >
          <List className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notification Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <div className="hidden lg:block">
            <UserProfileDropdown direction="down" />
          </div>
        </div>
      </div>
    </header>
  );
}
