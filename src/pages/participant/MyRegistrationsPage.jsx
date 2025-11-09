import React, { useEffect, useState } from "react";
import { api } from "../../api/api.js";
import TicketCard from "../../components/TicketCard.jsx";
import { usePageContext } from "../../context/PageContext.jsx";

export default function MyRegistrationsPage() {
  const { navigate } = usePageContext();

  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load my registrations
  useEffect(() => {
    const fetchRegs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/registrations/my");
        setRegs(data);
      } catch (err) {
        console.error("Error loading registrations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        My Registrations
      </h1>

      {regs.length === 0 ? (
        <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-lg shadow border dark:border-gray-800">
          <p className="text-gray-700 dark:text-gray-300">
            You haven’t registered for any events yet.
          </p>

          <button
            onClick={() => navigate("participant-dashboard")}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {regs.map((r) => (
            <TicketCard key={r._id} registration={r} />
          ))}
        </div>
      )}
    </div>
  );
}
