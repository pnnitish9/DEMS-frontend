import React, { useEffect, useState, useMemo } from "react";
import { api } from "../../api/api.js";
import { EventCard } from "../../components/EventCard.jsx";
import { usePageContext } from "../../context/PageContext.jsx";
import { toast } from "react-toastify";

export default function ParticipantDashboard() {
  const { navigate, searchQuery } = usePageContext();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);

  const [cancelPopup, setCancelPopup] = useState({
    open: false,
    title: "",
    reason: "",
  });

  /* ✅ FETCH EVENTS + USER REGISTRATIONS */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const evRes = await api.get("/events");
        const regRes = await api.get("/registrations/my");

        setEvents(evRes.data);
        setUserRegistrations(regRes.data);
      } catch (err) {
        console.error("Loading error:", err);
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ✅ Check if user registered */
  const isRegistered = (eventId) =>
    userRegistrations.some((r) => String(r.event?._id) === String(eventId));

  /* ✅ Register Handler */
  const handleRegister = async (eventId) => {
    const ev = events.find((e) => e._id === eventId);

    // ✅ Cancelled event popup
    if (ev?.isCancelled) {
      setCancelPopup({
        open: true,
        title: ev.title,
        reason: ev.cancelReason || "Event cancelled by organizer",
      });
      return false;
    }

    // ✅ Already registered
    if (isRegistered(eventId)) {
      toast.info("You already registered for this event");
      return false;
    }

    try {
      const { data } = await api.post("/registrations", { eventId });

      // Add to local state
      setUserRegistrations((prev) => [...prev, data]);

      // Mark event as registered
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId ? { ...e, isRegistered: true } : e
        )
      );

      toast.success("Successfully registered!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  /* ✅ FILTERED EVENTS (Live Search) */
  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (!q) return events;

    return events.filter((e) => {
      const title = e.title?.toLowerCase() || "";
      const category = e.category?.toLowerCase() || "";
      const location = e.location?.toLowerCase() || "";

      return (
        title.includes(q) ||
        category.includes(q) ||
        location.includes(q)
      );
    });
  }, [events, searchQuery]);

  /* ✅ LOADING SKELETON */
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse h-80 bg-gray-200 dark:bg-gray-800 rounded-xl"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Upcoming Events
      </h1>

      {filteredEvents.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No matching events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={{
                ...event,
                isRegistered: isRegistered(event._id),
              }}
              onClick={() =>
                navigate("event-details", { eventId: event._id })
              }
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      {/* ✅ CANCELLED EVENT POPUP */}
      {cancelPopup.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600">Event Cancelled</h2>

            <p className="mt-2 text-gray-800 dark:text-gray-200 font-semibold">
              {cancelPopup.title}
            </p>

            <p className="mt-3 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {cancelPopup.reason}
            </p>

            <button
              onClick={() => setCancelPopup({ open: false, title: "", reason: "" })}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
