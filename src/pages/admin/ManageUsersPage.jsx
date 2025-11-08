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

  const usersPerPage = 5;
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

      // remove admin accounts from table
      setUsers(res.data.filter((u) => u.role !== "admin"));
    } catch (err) {
      addNotification("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ------------------ Filters ------------------ */
  const filtered = users
    .filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) => (filterRole === "all" ? true : u.role === filterRole));

  /* ------------------ Pagination ------------------ */
  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const paginatedUsers = filtered.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  /* ------------------ Modal Handlers ------------------ */
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

  /* ------------------ API ROLE UPDATE ------------------ */
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

  /* ------------------ API DELETE USER ------------------ */
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

  /* ------------------ Glass-UI Modal Wrapper ------------------ */
  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-6 shadow-2xl w-full max-w-md relative animate-scaleIn">
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

  return (
    <div className="pb-20 px-4 sm:px-6 md:px-10 lg:px-0">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* ✅ Search + Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 flex-1">
          <Search className="w-5 h-5 text-slate-300" />
          <input
            className="bg-transparent ml-3 w-full outline-none text-white"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Filter */}
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

      {/* ✅ USERS TABLE (Desktop) */}
      <div className="hidden md:block bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
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

        {/* ✅ Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/5">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="text-white/70 hover:text-white flex items-center gap-1 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" /> Prev
          </button>

          <span className="text-white/70">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="text-white/70 hover:text-white flex items-center gap-1 disabled:opacity-30"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ✅ MOBILE CARD LAYOUT */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((u) => (
          <div
            key={u._id}
            className="p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow cursor-pointer"
            onClick={() => openProfileModal(u)}
          >
            <p className="font-semibold text-lg">{u.name}</p>
            <p className="text-sm text-slate-300 mb-3">{u.email}</p>

            <span className="px-3 py-1 text-xs rounded-full bg-white/10">
              {u.role}
            </span>

            <div className="flex justify-between mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openRoleModal(u);
                }}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Change Role
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(u);
                }}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="flex justify-between items-center mt-4 px-1">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-3 py-2 bg-white/10 rounded-lg disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          <span className="text-white/80">
            {page} / {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="px-3 py-2 bg-white/10 rounded-lg disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* ✅ ROLE MODAL */}
      {showRoleModal && (
        <Modal onClose={() => setShowRoleModal(false)}>
          <h2 className="text-xl font-semibold text-center mb-4">
            Change User Role
          </h2>

          <p className="text-slate-300 mb-4">
            Updating: <strong>{selectedUser.name}</strong>
          </p>

          <select
            className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-white/20 backdrop-blur-xl mb-6"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="participant">Participant</option>
            <option value="organizer">Organizer</option>
          </select>

          <button
            onClick={updateRole}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-700 text-white shadow-lg"
          >
            Save Changes
          </button>
        </Modal>
      )}

      {/* ✅ DELETE MODAL */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h2 className="text-xl font-semibold text-center mb-4">
            Delete User
          </h2>

          <p className="text-slate-300 text-center mb-6">
            Are you sure you want to delete{" "}
            <strong>{selectedUser.name}</strong>?<br />
            This action cannot be undone.
          </p>

          <button
            onClick={deleteUser}
            className="w-full px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-700 text-white mb-4"
          >
            Delete User
          </button>

          <button
            onClick={() => setShowDeleteModal(false)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            Cancel
          </button>
        </Modal>
      )}

      {/* ✅ PROFILE DETAILS MODAL */}
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
