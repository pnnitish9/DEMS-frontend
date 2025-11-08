import React from "react";
import {
  Calendar,
  MapPin,
  Users2,
  UserPlus
} from "lucide-react";

export function EventCard({ event, onClick, onRegister }) {
  const eventDate = event?.date ? new Date(event.date) : null;

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-800 p-5 hover:shadow-xl transition cursor-pointer"
      onClick={onClick}
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {event?.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
        {event?.description || "No description available"}
      </p>

      {/* Date */}
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-700 dark:text-gray-300">
        <Calendar className="w-4 h-4" />
        {eventDate
          ? eventDate.toLocaleDateString("en-GB") +
            " at " +
            eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "Date not available"}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-700 dark:text-gray-300">
        <MapPin className="w-4 h-4" />
        {event?.location || "Location not specified"}
      </div>

      <hr className="my-4 border-gray-300 dark:border-gray-700" />

      {/* ✅ BUTTON STATES */}
      {event?.isCancelled ? (
        /* EVENT CANCELLED */
        <button
          className="w-full py-2 bg-red-600 text-white rounded-lg opacity-80 cursor-not-allowed"
          onClick={(e) => e.stopPropagation()}
          disabled
        >
          ❌ Event Cancelled
        </button>
      ) : event?.isRegistered ? (
        /* ALREADY REGISTERED */
        <button
          className="w-full py-2 bg-red-500 text-white rounded-lg opacity-90 cursor-not-allowed"
          onClick={(e) => e.stopPropagation()}
          disabled
        >
          ✅ Already Registered
        </button>
      ) : (
        /* REGISTER NOW */
        <button
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation(); // Prevents card click from opening details first
            onRegister(event._id);
          }}
        >
          <UserPlus className="w-4 h-4" />
          Register Now
        </button>
      )}
    </div>
  );
}
