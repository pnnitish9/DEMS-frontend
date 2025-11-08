import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useNotificationContext } from "../../context/NotificationContext.jsx";
import { Edit } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, updateUser } = useAuthContext();
  const { addNotification } = useNotificationContext();

  const [name, setName] = useState(currentUser.name);
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  const handleSave = async () => {
    const success = await updateUser(name);
    if (success) {
      addNotification("Profile Updated", "Name updated successfully.");
      setIsEditing(false);
    } else {
      addNotification("Error", "Failed to update your name.", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="p-8 bg-white dark:bg-gray-950 rounded-lg shadow border dark:border-gray-800">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-4xl">
            {getInitials(currentUser.name)}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <input
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 text-2xl font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h2 className="text-3xl font-bold">{currentUser.name}</h2>
            )}

            <p className="text-lg text-gray-500 dark:text-gray-400">
              {currentUser.email}
            </p>

            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium capitalize">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t dark:border-gray-700 pt-6 mt-8 text-right">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(currentUser.name);
                }}
                className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="ml-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              <Edit className="w-4 h-4 inline-block mr-2" />
              Edit Name
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
