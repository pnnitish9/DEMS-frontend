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

  /* ------------------ Search & Filters & Pagination ------------------ */
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const usersPerPage = 5;
  const [page, setPage] = useState(1);

  /* ------------------ Modals ------------------ */
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("participant");

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  /* ------------------ Load Users ------------------ */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");

      // ✅ Exclude admin accounts
      const filtered = res.data.filter((u) => u.role !== "admin");

      setUsers(filtered);
    } catch (err) {
      addNotification("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ------------------ Filter Logic ------------------ */
  const filteredUsers = users
    .filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) => (filterRole === "all" ? true : u.role === filterRole));

  /* ------------------ Pagination Logic ------------------ */
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  /* ------------------ Modal Handlers ------------------ */
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openProfileModal = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  /* ------------------ Backend Role Update ------------------ */
  const updateRole = async () => {
    try {
      await api.put(`/admin/users/${selectedUser._id}/role`, {
        role: newRole,
      });
      addNotification("Role updated successfully");
      setShowRoleModal(false);
      loadUsers();
    } catch {
      addNotification("Failed to update role");
    }
  };

  /* ------------------ Backend Delete ------------------ */
  const deleteUser = async () => {
    try {
      await api.delete(`/admin/users/${selectedUser._id}`);
      addNotification("User deleted successfully");
      setShowDeleteModal(false);
      loadUsers();
    } catch {
      addNotification("Failed to delete user");
    }
  };

  /* ------------------ Modal Component ------------------ */
  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 border border-white/10 rounded-2xl backdrop-blur-xl p-6 shadow-2xl w-full max-w-md animate-scaleIn relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );

  /* ------------------ Page Change ------------------ */
  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* ------------------ Search + Filter Section ------------------ */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        {/* Search Bar */}
        <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 flex-1">
          <Search className="w-5 h-5 text-slate-300" />
          <input
            className="bg-transparent ml-3 w-full outline-none text-white"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Role Filter */}
        <select
          className="px-4 py-2 bg-black/10 text-white border border-white/10 backdrop-blur-xl rounded-xl"
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

      {/* ------------------ Users Table ------------------ */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading users...</div>
      ) : (
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">

          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-xs uppercase text-slate-400 text-left">
                  User
                </th>
                <th className="px-6 py-3 text-xs uppercase text-slate-400">
                  Role
                </th>
                <th className="px-6 py-3 text-xs uppercase text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {paginatedUsers.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-white/5 transition cursor-pointer"
                  onClick={() => openProfileModal(u)}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-sm text-slate-400">{u.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-white/10">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex gap-4">

                    <button
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRoleModal(u);
                      }}
                    >
                      <Shield className="w-4 h-4" /> Role
                    </button>

                    <button
                      className="text-red-400 hover:text-red-300 flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(u);
                      }}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {/* ------------------ Pagination ------------------ */}
          <div className="flex items-center justify-between px-6 py-4 bg-white/5">
            <button
              className="text-white/70 hover:text-white flex items-center gap-1"
              onClick={prevPage}
              disabled={page === 1}
            >
              <ChevronLeft className="w-5 h-5" /> Prev
            </button>

            <span className="text-white/70">
              Page {page} of {totalPages}
            </span>

            <button
              className="text-white/70 hover:text-white flex items-center gap-1"
              onClick={nextPage}
              disabled={page === totalPages}
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

      {/* ------------------ Role Modal ------------------ */}
      {showRoleModal && (
        <Modal onClose={() => setShowRoleModal(false)}>
          <h2 className="text-xl font-semibold text-center mb-4">
            Change User Role
          </h2>

          <p className="text-slate-300 mb-4">
            Updating: <strong>{selectedUser.name}</strong>
          </p>

          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-white/20 mb-6 backdrop-blur-xl"
          >
            <option value="participant">Participant</option>
            <option value="organizer">Organizer</option>
          </select>

          <button
            onClick={updateRole}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-700 text-white shadow-lg backdrop-blur-xl"
          >
            Save Changes
          </button>
        </Modal>
      )}

      {/* ------------------ Delete Modal ------------------ */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h2 className="text-xl font-semibold text-center mb-4">
            Delete User
          </h2>

          <p className="text-slate-300 text-center mb-6">
            Are you sure you want to delete{" "}
            <strong>{selectedUser.name}</strong>?  
            <br />
            This action cannot be undone.
          </p>

          <button
            onClick={deleteUser}
            className="w-full px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-700 text-white shadow-lg backdrop-blur-xl mb-4"
          >
            Delete User
          </button>

          <button
            onClick={() => setShowDeleteModal(false)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            Cancel
          </button>
        </Modal>
      )}

      {/* ------------------ Profile Preview Modal ------------------ */}
      {showProfileModal && (
        <Modal onClose={() => setShowProfileModal(false)}>
          <div className="flex flex-col items-center text-center">
            <User2 className="w-16 h-16 text-indigo-400 mb-4" />

            <h2 className="text-2xl font-semibold mb-2">
              {selectedUser.name}
            </h2>

            <p className="text-slate-300 flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5" />
              {selectedUser.email}
            </p>

            <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
              {selectedUser.role}
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
}
