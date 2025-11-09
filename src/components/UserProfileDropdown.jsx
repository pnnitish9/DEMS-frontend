import React, { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { LogOut, User, Settings } from "lucide-react";
import { usePageContext } from "../context/PageContext";

export default function UserProfileDropdown({ direction = "down" }) {
  const { currentUser, logout } = useAuthContext();
  const { navigate } = usePageContext();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  /* ✅ Close dropdown on outside click */
  useEffect(() => {
    const closeIfOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeIfOutside);
    return () => document.removeEventListener("mousedown", closeIfOutside);
  }, []);

  /* ✅ Close dropdown on ESC */
  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* ✅ User Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-3 px-4 py-2
          rounded-full bg-gray-100 dark:bg-gray-800
          hover:bg-gray-200 dark:hover:bg-gray-700
          text-gray-700 dark:text-gray-200
          transition shadow-sm
        "
      >
        <div
          className="
            w-8 h-8 rounded-full 
            bg-indigo-500 text-white 
            flex items-center justify-center font-semibold
          "
        >
          {currentUser?.name?.charAt(0).toUpperCase()}
        </div>

        <span className="font-medium max-w-[120px] truncate">
          {currentUser?.name}
        </span>
      </button>

      {/* ✅ Dropdown */}
      {open && (
        <div
          className={`
            absolute ${direction === "up" ? "bottom-full mb-2" : "top-full mt-2"} 
            right-0 w-56 
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-800
            rounded-xl shadow-xl z-50
            animate-fadeIn
          `}
        >
          {/* Profile */}
          <button
            onClick={() => {
              navigate("profile");
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 
              text-left hover:bg-gray-100 dark:hover:bg-gray-800 
              text-gray-700 dark:text-gray-300 transition"
          >
            <User className="w-5 h-5" />
            Profile
          </button>

          {/* ✅ Settings Button */}
          <button
            onClick={() => {
              navigate("settings");
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 
              text-left hover:bg-gray-100 dark:hover:bg-gray-800 
              text-gray-700 dark:text-gray-300 transition"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 
              text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
              transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
