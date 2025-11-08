import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import useData from "../../hooks/useData";

export default function ManageEventsPage() {
  const { dataActions } = useData();
  const { approveEvent } = dataActions;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/events");
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleStatus = async (id, approve) => {
    const ok = await approveEvent(id, approve);
    if (ok) loadEvents();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-indigo-600 rounded-full"></div>
      </div>
    );

  return (
    <div className="pb-20 px-4 sm:px-6 md:px-10 lg:px-0">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

      <div className="bg-white dark:bg-gray-950 rounded-lg shadow border dark:border-gray-800 overflow-hidden">

        {/* ✅ DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Event</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Organizer</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-gray-800">
              {events.map((ev) => (
                <tr key={ev._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="px-6 py-4">
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-sm text-gray-500">{ev.category}</div>
                  </td>

                  <td className="px-6 py-4">{ev.organizer?.name ?? "N/A"}</td>

                  <td className="px-6 py-4">
                    {ev.isApproved ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {ev.isApproved ? (
                      <button
                        onClick={() => handleStatus(ev._id, false)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
                      >
                        Unlist
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatus(ev._id, true)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4 p-4">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700"
            >
              {/* Event Info */}
              <div className="mb-3">
                <h2 className="font-bold text-lg">{ev.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{ev.category}</p>
              </div>

              {/* Organizer */}
              <div className="mb-3">
                <p className="text-xs uppercase text-gray-500">Organizer</p>
                <p>{ev.organizer?.name ?? "N/A"}</p>
              </div>

              {/* Status */}
              <div className="mb-3">
                <p className="text-xs uppercase text-gray-500">Status</p>

                {ev.isApproved ? (
                  <span className="px-3 py-1 inline-block mt-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Approved
                  </span>
                ) : (
                  <span className="px-3 py-1 inline-block mt-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pending
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-3 mt-4">

                {ev.isApproved ? (
                  <button
                    onClick={() => handleStatus(ev._id, false)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                  >
                    Unlist
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatus(ev._id, true)}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
