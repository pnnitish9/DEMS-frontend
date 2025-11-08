import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import {
  Trash2,
  Shield,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  User2,
  Mail,
} from "lucide-react";
import { useNotificationContext } from "../../context/NotificationContext";

export default function ManageUsersPage() {
  const { addNotification } = useNotificationContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ Search, Filter, Pagination ------------------ */
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const usersPerPage = 6;
  const [page, setPage] = useState(1);

  /* ------------------ Modals ------------------ */
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("participant");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  /* ------------------ Fetch Users ------------------ */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");

      // remove admins
      setUsers(res.data.filter((u) => u.role !== "admin"));
    } catch (err) {
      addNotification("Error loading users", "Unable to fetch users.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ------------------ Filtering ------------------ */
  const filteredUsers = users
    .filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) => (filterRole === "all" ? true : u.role === filterRole));

  /* ------------------ Pagination ------------------ */
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  /* ------------------ Modals ------------------ */
  const openRoleModal = (u) => {
    setSelectedUser(u);
    setNewRole(u.role);
    setShowRoleModal(true);
  };

  const openDeleteModal = (u) => {
    setSelectedUser(u);
    setShowDeleteModal(true);
  };

  const openProfileModal = (u) => {
    setSelectedUser(u);
    setShowProfileModal(true);
  };

  /* ------------------ Update Role ------------------ */
  const updateRole = async () => {
    try {
      await api.put(`/admin/users/${selectedUser._id}/role`, {
        role: newRole,
      });

      addNotification("Role Updated", `${selectedUser.name}'s role updated`);
      setShowRoleModal(false);
      loadUsers();
    } catch {
      addNotification("Error", "Failed to update role", "error");
    }
  };

  /* ------------------ Delete User ------------------ */
  const deleteUser = async () => {
    try {
      await api.delete(`/admin/users/${selectedUser._id}`);

      addNotification("User Removed", "User deleted successfully");
      setShowDeleteModal(false);
      loadUsers();
    } catch {
      addNotification("Error", "Failed to delete user", "error");
    }
  };

  /* ------------------ Modal Wrapper ------------------ */
  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="
        bg-white dark:bg-gray-900 
        border border-gray-300 dark:border-gray-700 
        rounded-xl shadow-xl w-full max-w-md relative
      ">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* ✅ Search + Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Search Box */}
        <div className="
          flex items-center gap-2 px-4 py-2 
          bg-white dark:bg-gray-900 
          border border-gray-300 dark:border-gray-700 
          rounded-lg shadow-sm w-full md:w-1/2
        ">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            className="flex-1 bg-transparent outline-none"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Role Filter */}
        <select
          className="
            px-4 py-2 bg-white dark:bg-gray-900 
            border border-gray-300 dark:border-gray-700 
            rounded-lg shadow-sm
          "
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Roles</option>
          <option value="participant">Participants</option>
          <option value="organizer">Organizers</option>
        </select>
      </div>

      {/* ✅ USERS TABLE (DESKTOP) */}
      <div className="
        hidden md:block 
        bg-white dark:bg-gray-950 
        border border-gray-300 dark:border-gray-800 
        rounded-xl shadow-sm overflow-hidden
      ">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                User
              </th>
              <th className="px-6 py-3 text-xs uppercase text-gray-500">Role</th>
              <th className="px-6 py-3 text-xs uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-gray-800">
            {paginatedUsers.map((u) => (
              <tr
                key={u._id}
                className="
                  hover:bg-gray-50 dark:hover:bg-gray-800/40 
                  cursor-pointer
                "
                onClick={() => openProfileModal(u)}
              >
                <td className="px-6 py-4">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </td>

                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-800"
                  >
                    {u.role}
                  </span>
                </td>

                <td className="px-6 py-4 flex gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openRoleModal(u);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Change Role
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(u);
                    }}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="text-gray-600 dark:text-gray-300 disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft className="w-5 h-5" />
            Prev
          </button>

          <span className="text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="text-gray-600 dark:text-gray-300 disabled:opacity-40 flex items-center gap-1"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ✅ MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((u) => (
          <div
            key={u._id}
            className="
              p-4 bg-white dark:bg-gray-900 
              border border-gray-300 dark:border-gray-700 
              rounded-xl shadow-sm cursor-pointer
            "
            onClick={() => openProfileModal(u)}
          >
            <p className="font-semibold text-lg">{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>

            <span className="px-3 py-1 mt-2 inline-block text-xs rounded-full bg-gray-200 dark:bg-gray-800">
              {u.role}
            </span>

            <div className="flex justify-between mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openRoleModal(u);
                }}
                className="text-indigo-600 dark:text-indigo-400"
              >
                Change Role
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(u);
                }}
                className="text-red-600 dark:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="flex justify-between mt-4 items-center">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          <span className="text-gray-600 dark:text-gray-300">
            {page} / {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* ✅ ROLE MODAL */}
      {showRoleModal && (
        <Modal onClose={() => setShowRoleModal(false)}>
          <h2 className="text-xl font-semibold mb-4">Change User Role</h2>

          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Updating: <strong>{selectedUser.name}</strong>
          </p>

          <select
            className="
              w-full px-4 py-2 bg-white dark:bg-gray-900 
              border border-gray-300 dark:border-gray-700 rounded-lg mb-6
            "
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="participant">Participant</option>
            <option value="organizer">Organizer</option>
          </select>

          <button
            onClick={updateRole}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Save Changes
          </button>
        </Modal>
      )}

      {/* ✅ DELETE MODAL */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h2 className="text-xl font-semibold mb-4">Delete User</h2>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Are you sure you want to delete{" "}
            <strong>{selectedUser.name}</strong>? <br />This action is permanent.
          </p>

          <button
            onClick={deleteUser}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg mb-3"
          >
            Delete User
          </button>

          <button
            onClick={() => setShowDeleteModal(false)}
            className="w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg"
          >
            Cancel
          </button>
        </Modal>
      )}

      {/* ✅ PROFILE MODAL */}
      {showProfileModal && (
        <Modal onClose={() => setShowProfileModal(false)}>
          <div className="flex flex-col items-center text-center">
            <User2 className="w-16 h-16 text-indigo-500 mb-4" />

            <h2 className="text-2xl font-semibold">{selectedUser.name}</h2>

            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
              <Mail className="w-5 h-5" />
              {selectedUser.email}
            </p>

            <span className="px-3 py-1 mt-4 rounded-full bg-gray-200 dark:bg-gray-800 text-sm">
              {selectedUser.role}
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
}
  