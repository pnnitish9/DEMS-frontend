import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useNotificationContext } from "../../context/NotificationContext.jsx";
import { Lock, ShieldAlert, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { changePassword, deleteAccount } = useAuthContext();
  const { addNotification } = useNotificationContext();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [deletePass, setDeletePass] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // ✅ Loading States
  const [isChanging, setIsChanging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsChanging(true);

    const success = await changePassword(currentPassword, newPassword);

    setIsChanging(false);

    if (success) {
      addNotification("Password Updated", "Your password has been changed.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError("Incorrect current password.");
    }
  };

  // ✅ Delete Account
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");

    setIsDeleting(true);

    const success = await deleteAccount(deletePass);

    setIsDeleting(false);

    if (success) {
      addNotification("Account Deleted", "Your account has been removed.", "error");
    } else {
      setDeleteError("Incorrect password. Account not deleted.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">⚙️ Account Settings</h1>

      {/* ✅ CHANGE PASSWORD CARD */}
      <div className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl shadow-md p-8">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-indigo-600" />
          <h2 className="text-xl font-bold">Change Password</h2>
        </div>

        {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <InputField label="Current Password" value={currentPassword} onChange={setCurrentPassword} />

          <InputField label="New Password" value={newPassword} onChange={setNewPassword} />

          <InputField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} />

          <button
            type="submit"
            disabled={isChanging}
            className={`w-full py-3 text-white font-semibold rounded-lg transition
              ${isChanging ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {isChanging ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* ✅ DELETE ACCOUNT CARD */}
      <div className="bg-white dark:bg-gray-950 border border-red-400 dark:border-red-700 rounded-xl shadow-md p-8">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="text-red-600" />
          <h2 className="text-xl font-bold text-red-600">Delete Account</h2>
        </div>

        {deleteError && <p className="text-red-500 font-medium mb-4">{deleteError}</p>}

        <form onSubmit={handleDelete} className="space-y-5">
          <InputField
            label="Confirm Password to Delete Account"
            value={deletePass}
            onChange={setDeletePass}
          />

          <button
            type="submit"
            disabled={isDeleting}
            className={`w-full py-3 text-white font-semibold rounded-lg transition
              ${isDeleting ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}`}
          >
            {isDeleting ? "Deleting..." : "Permanently Delete My Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Reusable Input Component
function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="password"
        className="w-full mt-2 px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
