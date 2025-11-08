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
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

      <div className="bg-white dark:bg-gray-950 rounded-lg shadow border dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
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
                <tr key={ev._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
      </div>
    </div>
  );
}
