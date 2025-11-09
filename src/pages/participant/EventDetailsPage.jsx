import React, { useEffect, useState } from "react";
import {
  Calendar,
  ArrowLeft,
  XCircle,
  MapPin,
  Users2,
  Clock,
} from "lucide-react";

import { api } from "../../api/api.js";
import { usePageContext } from "../../context/PageContext.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";

import TicketCard from "../../components/TicketCard.jsx";

const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1531058020387-3be344556be6";

export default function EventDetailsPage() {
  const { pageData, navigate } = usePageContext();
  const { currentUser } = useAuthContext();

  const eventId = pageData?.eventId;

  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState({ expired: false });

  /* ✅ Load event details + user registration */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const eventRes = await api.get(`/events/${eventId}`);
        const ev = eventRes.data;
        setEvent(ev);

        const myRegs = await api.get("/registrations/my");

        const reg = myRegs.data.find(
          (r) => String(r.event?._id) === String(eventId)
        );

        setIsRegistered(!!reg);
        setRegistration(reg || null);

        if (currentUser?.role !== "participant") {
          const all = await api.get(`/registrations/event/${eventId}`);
          setAttendeeCount(all.data.length);
        }
      } catch (e) {
        console.error("Failed to load event:", e);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) load();
  }, [eventId]);

  /* ✅ Countdown Timer */
  useEffect(() => {
    if (!event?.date) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const target = new Date(event.date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimer({ expired: true });
      } else {
        setTimer({
          expired: false,
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  const handleRegister = async () => {
    try {
      const { data } = await api.post("/registrations", { eventId });
      setIsRegistered(true);
      setRegistration(data);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-indigo-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      <button
        onClick={() => navigate("participant-dashboard")}
        className="flex items-center text-indigo-600 dark:text-indigo-400 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border dark:border-gray-800 overflow-hidden">

        {/* ✅ EVENT BANNER */}
        <div
          className="h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url(${event.poster || DEFAULT_POSTER})`,
          }}
        ></div>

        <div className="p-8">
          <p className="text-sm font-medium text-indigo-600">{event.category}</p>

          <h1 className="text-4xl font-bold mt-1 dark:text-white">
            {event.title}
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
            {event.description}
          </p>

          {/* ✅ Cancel Notice */}
          {event.isCancelled && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <h2 className="text-lg font-bold text-red-700 dark:text-red-300">
                🚫 This Event Has Been Cancelled
              </h2>
              <p className="mt-2 text-red-600 dark:text-red-300 whitespace-pre-wrap">
                {event.cancelReason || "Cancelled by organizer."}
              </p>
            </div>
          )}

          {/* ✅ INFO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            {/* Organizer */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center">
                <Users2 className="w-4 h-4 mr-2" /> Organizer
              </p>
              <p className="text-lg font-semibold mt-1">{event.organizer?.name}</p>
            </div>

            {/* Attendance */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center">
                <Users2 className="w-4 h-4 mr-2" /> Attendance
              </p>

              {registration?.checkIn ? (
                <p className="text-2xl font-bold text-green-600 mt-1">Present</p>
              ) : (
                <p className="text-2xl font-bold mt-1">
                  {attendeeCount ?? "—"}
                </p>
              )}
            </div>

            {/* Timer */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-2" /> Time Left
              </p>

              {timer.expired ? (
                <p className="text-red-600 mt-1">Event Started</p>
              ) : (
                <p className="text-xl font-bold mt-1">
                  {timer.days}d {timer.hours}h {timer.minutes}m {timer.seconds}s
                </p>
              )}
            </div>
          </div>

          {/* ✅ GOOGLE MAP */}
          {event.location && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">{event.location}</span>
              </div>

              <iframe
                width="100%"
                height="300"
                className="rounded-lg border dark:border-gray-800"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  event.location
                )}&output=embed`}
              ></iframe>
            </div>
          )}

          {/* ✅ TICKET / REGISTER */}
          <div className="mt-10">
            {event.isCancelled ? (
              <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-lg text-center">
                <XCircle className="w-5 h-5 inline mr-2 text-red-600" />
                Registration Closed — Event Cancelled
              </div>
            ) : isRegistered ? (
              <TicketCard registration={registration} />
            ) : (
              <div className="text-center">
                <button
                  onClick={handleRegister}
                  disabled={timer.expired}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                >
                  Register Now
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
