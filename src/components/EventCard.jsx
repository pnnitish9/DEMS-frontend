import React, { useState } from "react";
import { Calendar, MapPin, UserPlus } from "lucide-react";

/* ✅ Default Poster */
const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1531058020387-3be344556be6";

export function EventCard({ event, onClick, onRegister }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const poster = event?.poster || DEFAULT_POSTER;
  const eventDate = event?.date ? new Date(event.date) : null;

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer 
                 group bg-white dark:bg-gray-900 transition-all hover:shadow-2xl"
      onClick={onClick}
    >
      {/* ✅ Responsive Image Wrapper */}
      <div className="relative h-48 sm:h-52 md:h-56 w-full overflow-hidden">

        {/* ✅ Skeleton Loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-800 animate-pulse" />
        )}

        {/* ✅ Poster Image */}
        <img
          src={poster}
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 
                      group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          alt="Event Poster"
        />

        {/* ✅ Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div>

        {/* ✅ Category Badge */}
        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 
                        rounded-full shadow-md">
          {event?.category || "General"}
        </span>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="p-4 text-gray-900 dark:text-white">

        {/* ✅ Title */}
        <h2 className="text-lg sm:text-xl font-bold line-clamp-1">
          {event?.title}
        </h2>

        {/* ✅ Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {event?.description || "No description available."}
        </p>

        {/* ✅ Date */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-700 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          {eventDate
            ? eventDate.toLocaleDateString("en-GB") +
              " • " +
              eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Date not available"}
        </div>

        {/* ✅ Location */}
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="w-4 h-4" />
          {event?.location || "Location not specified"}
        </div>

        {/* ==================== ACTION BUTTON ==================== */}
        <div className="mt-4">
          {event?.isCancelled ? (
            <button
              className="w-full py-2 bg-red-600 text-white rounded-lg opacity-70 cursor-not-allowed"
              disabled
              onClick={(e) => e.stopPropagation()}
            >
              ❌ Event Cancelled
            </button>
          ) : event?.isRegistered ? (
            <button
              className="w-full py-2 bg-green-600 text-white rounded-lg opacity-90 cursor-not-allowed"
              disabled
              onClick={(e) => e.stopPropagation()}
            >
              ✅ Registered
            </button>
          ) : (
            <button
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg 
                         flex items-center justify-center gap-2 transition"
              onClick={(e) => {
                e.stopPropagation();
                onRegister(event._id);
              }}
            >
              <UserPlus className="w-4 h-4" />
              Register Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
