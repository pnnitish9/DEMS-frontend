import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { usePageContext } from "../context/PageContext";
import { Users, Edit, BarChart2, Calendar, QrCode, Plus } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Sidebar({ isOpen, closeSidebar }) {
  const { currentUser } = useAuthContext();
  const { navigate } = usePageContext();

  const navItems = {
    participant: [
      { name: "Browse Events", icon: Calendar, page: "participant-dashboard" },
      { name: "My Registrations", icon: QrCode, page: "my-registrations" },
    ],
    organizer: [
      { name: "Dashboard", icon: BarChart2, page: "organizer-dashboard" },
      { name: "Create Event", icon: Plus, page: "create-event" },
    ],
    admin: [
      { name: "Dashboard", icon: BarChart2, page: "admin-dashboard" },
      { name: "Manage Events", icon: Edit, page: "manage-events" },
      { name: "Manage Users", icon: Users, page: "manage-users" },
    ],
  };

  const items = navItems[currentUser?.role] || [];

  return (
    <>
      {/* ✅ Overlay for mobile */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 lg:hidden z-20"
        ></div>
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-950 shadow-lg border-r dark:border-gray-800 z-30
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:flex flex-col`}
      >
        {/* Close btn for mobile */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 text-gray-700 dark:text-gray-300"
        >
          ✕
        </button>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            DEMP
          </h1>
        </div>

        <nav className="flex-1 flex flex-col justify-between mt-8">
          <ul className="px-4 space-y-2">
            {items.map(({ name, icon: Icon, page }) => (
              <li key={name}>
                <button
                  onClick={() => {
                    navigate(page);
                    closeSidebar(); // ✅ auto-close on mobile
                  }}
                  className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 
                  rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="px-4 mb-6">
            <UserProfileDropdown direction="up" />
          </div>
        </nav>
      </aside>
    </>
  );
}
