import React, { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { usePageContext } from "../context/PageContext";

export default function UserProfileDropdown({ direction = "down" }) {
  const { currentUser, logout } = useAuthContext();
  const { navigate } = usePageContext();
  const [open, setOpen] = useState(false);

  if (!currentUser) return null;

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
          {initials}
        </div>

        <div className="hidden lg:block text-left">
          <p className="font-semibold text-sm">{currentUser.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
        </div>
      </button>

      {open && (
        <div
          className={`absolute bg-white dark:bg-gray-950 border dark:border-gray-800 shadow-lg rounded-md w-56 py-2 z-50 ${
            direction === "up" ? "bottom-full mb-2 left-0" : "top-full mt-2 right-0"
          }`}
        >
          <button
            onClick={() => {
              navigate("profile");
              setOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </button>

          <button
            onClick={() => {
              navigate("settings");
              setOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="w-4 h-4 mr-2" /> Settings
          </button>

          <div className="border-t dark:border-gray-700 my-2"></div>

          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
