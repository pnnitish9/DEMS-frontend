import React, { useEffect, useState } from "react";
import { Calendar, Users, Check, Trash2, Slash } from "lucide-react";
import { api } from "../../api/api";
import { usePageContext } from "../../context/PageContext";
import { StatCard } from "../../components/StatCard";

export default function OrganizerDashboard() {
  const { navigate } = usePageContext();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Modal State
  const [deleteModal, setDeleteModal] = useState({ open: false, event: null });
  const [cancelModal, setCancelModal] = useState({ open: false, event: null, reason: "" });

  /* ---------------------- Load Events ---------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: eventData } = await api.get("/events/organizer");
        setEvents(eventData);

        let allRegs = [];
        for (let ev of eventData) {
          try {
            const { data: regs } = await api.get(`/registrations/event/${ev._id}`);
            allRegs = [...allRegs, ...regs];
          } catch {}
        }
        setRegistrations(allRegs);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );

  const totalRegs = registrations.length;
  const totalCheckIns = registrations.filter((r) => r.checkIn).length;

  /* ---------------------- Delete Event Handler ---------------------- */
  const confirmDelete = async () => {
    if (!deleteModal.event) return;

    try {
      await api.delete(`/events/${deleteModal.event._id}`);
      setDeleteModal({ open: false, event: null });

      // Refresh page
      setEvents(events.filter((e) => e._id !== deleteModal.event._id));
    } catch {
      alert("Failed to delete event.");
    }
  };

  /* ---------------------- Cancel Event Handler ---------------------- */
  const confirmCancel = async () => {
    if (!cancelModal.event || !cancelModal.reason.trim()) return;

    try {
      await api.put(`/events/cancel/${cancelModal.event._id}`, {
        reason: cancelModal.reason,
      });

      setCancelModal({ open: false, event: null, reason: "" });

      // Refresh events (update UI)
      setEvents(
        events.map((ev) =>
          ev._id === cancelModal.event._id
            ? { ...ev, isCancelled: true, cancelReason: cancelModal.reason }
            : ev
        )
      );
    } catch {
      alert("Failed to cancel event.");
    }
  };

  /* ---------------------- UI ---------------------- */
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Organizer Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="My Events" value={events.length} icon={Calendar} />
        <StatCard title="Registrations" value={totalRegs} icon={Users} />
        <StatCard title="Total Check-ins" value={totalCheckIns} icon={Check} />
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-gray-950 shadow rounded-lg border dark:border-gray-800 overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">My Events</h2>
          <button
            onClick={() => navigate("create-event")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Create Event
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Event</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Registrations</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-gray-800">
              {events.map((event) => {
                const count = registrations.filter((r) => r.event === event._id).length;

                return (
                  <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.category}</div>

                      {event.isCancelled && (
                        <p className="text-xs text-red-600 mt-1">
                          Cancelled — {event.cancelReason}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {event.isCancelled ? (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                          Cancelled
                        </span>
                      ) : event.isApproved ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">{count}</td>

                    <td className="px-6 py-4 space-x-4">
                      <button
                        onClick={() =>
                          navigate("manage-participants", { eventId: event._id })
                        }
                        className="text-indigo-600 hover:underline"
                      >
                        Manage
                      </button>

                      {/* Cancel */}
                      {!event.isCancelled && (
                        <button
                          onClick={() => setCancelModal({ open: true, event, reason: "" })}
                          className="text-yellow-600 hover:underline flex items-center"
                        >
                          <Slash className="w-4 h-4 mr-1" /> Cancel
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteModal({ open: true, event })}
                        className="text-red-600 hover:underline flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Event?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, event: null })}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CANCEL MODAL */}
      {cancelModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Cancel Event?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Participants will see this reason.
            </p>

            <textarea
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              rows="3"
              placeholder="Enter cancellation reason..."
              value={cancelModal.reason}
              onChange={(e) =>
                setCancelModal({ ...cancelModal, reason: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setCancelModal({ open: false, event: null, reason: "" })}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                Close
              </button>

              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white"
                disabled={!cancelModal.reason.trim()}
              >
                Cancel Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
