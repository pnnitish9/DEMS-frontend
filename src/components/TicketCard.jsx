import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { Calendar, MapPin, Users2, XCircle, Download } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export default function TicketCard({ registration }) {
  const [qr, setQr] = useState("");
  const { currentUser } = useAuthContext();

  const cardRef = useRef(null); // ✅ Reference for screenshot

  const event = registration?.event;
  const eventDate = event ? new Date(event.date) : null;

  /* ✅ Generate QR Code */
  useEffect(() => {
    if (!registration?.qrCode) return;

    (async () => {
      try {
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, registration.qrCode, { width: 200 });
        setQr(canvas.toDataURL());
      } catch (err) {
        console.error("QR error:", err);
      }
    })();
  }, [registration]);

  /* ✅ Download Ticket as Image */
  const downloadTicket = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = `ticket-${event?.title || "event"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* ✅ Download Button */}
      <button
        onClick={downloadTicket}
        className="mb-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 shadow"
      >
        <Download className="w-5 h-5" /> Download Ticket
      </button>

      {/* ✅ Ticket Card */}
      <div
        ref={cardRef}
        className="bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        {/* Cancel Banner */}
        {event?.isCancelled && (
          <div className="bg-red-600 text-white py-2 px-4 text-center flex items-center justify-center">
            <XCircle className="w-5 h-5 mr-2" />
            <span className="font-semibold">This event has been cancelled</span>
          </div>
        )}

        {/* QR Section */}
        <div className="p-4 bg-indigo-600 text-white dark:bg-indigo-800">
          <div className="flex justify-center">
            {qr ? (
              <img src={qr} className="w-32 h-32 rounded-md" alt="QR Code" />
            ) : (
              <div className="w-32 h-32 bg-white/20 rounded-md flex items-center justify-center">
                Loading…
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold">
            {currentUser?.name || "Participant"}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {event?.title}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 mb-3">
            {event?.description || ""}
          </p>

          {event?.isCancelled && (
            <p className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm p-2 rounded-lg mb-3">
              {event.cancelReason || "Event was cancelled."}
            </p>
          )}

          <div className="grid grid-cols-3 mt-4 text-xs text-gray-600 dark:text-gray-400">

            <div className="flex flex-col items-center">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold mt-1">
                {eventDate?.toLocaleDateString() || "--"}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold mt-1">
                {event?.location || "Venue"}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Users2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold mt-1">
                {event?.organizer?.name || "Organizer"}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
