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

  // ✅ Modal States
  const [deleteModal, setDeleteModal] = useState({ open: false, event: null });
  const [cancelModal, setCancelModal] = useState({
    open: false,
    event: null,
    reason: "",
  });

  /* ✅ Load Events + Registrations */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const { data: eventData } = await api.get("/events/organizer");
        setEvents(eventData);

        let all = [];
        for (let ev of eventData) {
          try {
            const { data: regs } = await api.get(
              `/registrations/event/${ev._id}`
            );
            all.push(...regs);
          } catch {}
        }
        setRegistrations(all);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-14 w-14 rounded-full border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );

  const totalRegs = registrations.length;
  const totalCheckIns = registrations.filter((r) => r.checkIn).length;

  /* ✅ Delete Event */
  const confirmDelete = async () => {
    if (!deleteModal.event) return;

    try {
      await api.delete(`/events/${deleteModal.event._id}`);
      setEvents(events.filter((e) => e._id !== deleteModal.event._id));
      setDeleteModal({ open: false, event: null });
    } catch {
      alert("Failed to delete event.");
    }
  };

  /* ✅ Cancel Event */
  const confirmCancel = async () => {
    if (!cancelModal.event || !cancelModal.reason.trim()) return;

    try {
      await api.put(`/events/cancel/${cancelModal.event._id}`, {
        reason: cancelModal.reason,
      });

      setEvents(
        events.map((ev) =>
          ev._id === cancelModal.event._id
            ? {
                ...ev,
                isCancelled: true,
                cancelReason: cancelModal.reason,
              }
            : ev
        )
      );

      setCancelModal({ open: false, event: null, reason: "" });
    } catch {
      alert("Failed to cancel event.");
    }
  };

  /* ✅ Responsive UI */
  return (
    <div className="pb-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Organizer Dashboard</h1>

      {/* ✅ Responsive Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="My Events" value={events.length} icon={Calendar} />
        <StatCard title="Registrations" value={totalRegs} icon={Users} />
        <StatCard title="Total Check-ins" value={totalCheckIns} icon={Check} />
      </div>

      {/* ✅ Events Section */}
      <div className="bg-white dark:bg-gray-950 shadow rounded-xl border dark:border-gray-800">

        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold">My Events</h2>

          <button
            onClick={() => navigate("create-event")}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full sm:w-auto"
          >
            Create Event
          </button>
        </div>

        {/* ✅ Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Event</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                  Registrations
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-gray-800">
              {events.map((ev) => {
                const count = registrations.filter((r) => r.event === ev._id).length;

                return (
                  <tr key={ev._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <p className="font-medium">{ev.title}</p>
                      <p className="text-sm text-gray-500">{ev.category}</p>

                      {ev.isCancelled && (
                        <p className="text-xs text-red-600 mt-1">
                          Cancelled — {ev.cancelReason}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {ev.isCancelled ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Cancelled
                        </span>
                      ) : ev.isApproved ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">{count}</td>

                    <td className="px-6 py-4 space-x-4">
                      <button
                        onClick={() =>
                          navigate("manage-participants", { eventId: ev._id })
                        }
                        className="text-indigo-600 hover:underline"
                      >
                        Manage
                      </button>

                      {!ev.isCancelled && (
                        <button
                          onClick={() =>
                            setCancelModal({ open: true, event: ev, reason: "" })
                          }
                          className="text-yellow-600 hover:underline"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setDeleteModal({ open: true, event: ev })
                        }
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile View (Cards) */}
        <div className="md:hidden p-4 space-y-4">
          {events.map((ev) => {
            const count = registrations.filter((r) => r.event === ev._id).length;

            return (
              <div
                key={ev._id}
                className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:border-gray-800 shadow-sm"
              >
                <p className="text-lg font-semibold">{ev.title}</p>
                <p className="text-sm text-gray-500">{ev.category}</p>

                {ev.isCancelled && (
                  <p className="text-xs text-red-600 mt-1">Cancelled — {ev.cancelReason}</p>
                )}

                {/* Status */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-semibold">Status:</span>

                  {ev.isCancelled ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Cancelled</span>
                  ) : ev.isApproved ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Pending
                    </span>
                  )}
                </div>

                {/* Registrations */}
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Registrations:</span> {count}
                </p>

                {/* Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() =>
                      navigate("manage-participants", { eventId: ev._id })
                    }
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-center"
                  >
                    Manage Participants
                  </button>

                  {!ev.isCancelled && (
                    <button
                      onClick={() =>
                        setCancelModal({ open: true, event: ev, reason: "" })
                      }
                      className="px-4 py-2 text-yellow-600 rounded-lg border border-yellow-600"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteModal({ open: true, event: ev })}
                    className="px-4 py-2 text-red-600 rounded-lg border border-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ DELETE MODAL */}
      {deleteModal.open && (
        <Modal>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Event?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This action is permanent.
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
        </Modal>
      )}

      {/* ✅ CANCEL MODAL */}
      {cancelModal.open && (
        <Modal>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Cancel Event?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Participants will see this reason.
            </p>

            <textarea
              rows="3"
              placeholder="Reason..."
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
              value={cancelModal.reason}
              onChange={(e) =>
                setCancelModal({ ...cancelModal, reason: e.target.value })
              }
            ></textarea>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() =>
                  setCancelModal({ open: false, event: null, reason: "" })
                }
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                Close
              </button>

              <button
                onClick={confirmCancel}
                disabled={!cancelModal.reason.trim()}
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white disabled:opacity-50"
              >
                Cancel Event
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ✅ Responsive Modal Component */
function Modal({ children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {children}
    </div>
  );
}
