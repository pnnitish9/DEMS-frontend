import React, { useEffect, useRef, useState } from "react";
import { api } from "../../api/api";
import { usePageContext } from "../../context/PageContext";
import { useDataContext } from "../../context/DataContext";
import QRScanner from "../../components/QRScanner";
import { toast } from "react-toastify";

export default function ManageParticipantsPage() {
  const { pageData } = usePageContext();
  const { checkInParticipant } = useDataContext();

  const eventId = pageData?.eventId;

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scannerOpen, setScannerOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // ✅ store scanned regIds (cooldown 10 minutes)
  const scannedCache = useRef({});

  /* ✅ Load Event + Registrations */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [evRes, regRes] = await Promise.all([
          api.get(`/events/${eventId}`),
          api.get(`/registrations/event/${eventId}`),
        ]);

        setEvent(evRes.data);
        setRegistrations(regRes.data);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) load();
  }, [eventId]);

  /* ✅ Refresh after check-in */
  const refresh = async () => {
    const { data } = await api.get(`/registrations/event/${eventId}`);
    setRegistrations(data);
  };

  /* ✅ Manual Check-in */
  const handleCheckIn = async (regId) => {
    const ok = await checkInParticipant(regId);

    if (ok) {
      toast.success("✅ Check-in successful");
      refresh();
    }
  };

  /* ✅ Search Handler */
  const handleSearch = () => {
    const q = searchText.trim().toLowerCase();
    if (!q) return setSearchResults([]);

    const results = registrations.filter((r) => {
      return (
        r.user.name.toLowerCase().includes(q) ||
        r.user.email.toLowerCase().includes(q)
      );
    });

    setSearchResults(results);
  };

  /* ✅ MULTI-SCAN QR Handler */
  const handleQRScan = async (value) => {
    try {
      const parsed = JSON.parse(value);
      const regId = parsed.regId;

      if (!regId) return toast.error("Invalid QR");

      const now = Date.now();
      const lastTime = scannedCache.current[regId];

      // ✅ Block same QR for 10 minutes
      if (lastTime && now - lastTime < 10 * 60 * 1000) {
        return;
      }

      scannedCache.current[regId] = now;

      const ok = await checkInParticipant(regId);

      if (ok) {
        toast.success(`✅ Scanned: ${parsed.name}`);
        await refresh();
      }
    } catch (err) {
      toast.error("Invalid QR Code");
    }
  };

  if (loading || !event)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-indigo-600 rounded-full"></div>
      </div>
    );

  return (
    <div className="pb-20">

      <h1 className="text-3xl font-bold mb-1">Manage Participants</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{event.title}</p>

      {/* ✅ Search + Scanner */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <button
          onClick={() => setScannerOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          QR Scanner
        </button>

        <input
          type="text"
          placeholder="Search name or email..."
          className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 w-full md:w-80"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyUp={handleSearch}
        />
      </div>

      {/* ✅ QR Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Scan QR</h2>

            <QRScanner onScan={handleQRScan} />

            <button
              onClick={() => setScannerOpen(false)}
              className="mt-5 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}

      {/* ✅ Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow mb-6">
          <h3 className="font-bold mb-3">Search Results</h3>

          <div className="space-y-3">
            {searchResults.map((reg) => (
              <div
                key={reg._id}
                className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{reg.user.name}</p>
                  <p className="text-sm">{reg.user.email}</p>
                </div>

                {reg.checkIn ? (
                  <span className="px-3 py-1 text-xs bg-green-200 text-green-800 rounded-full">
                    Checked In
                  </span>
                ) : (
                  <button
                    onClick={() => handleCheckIn(reg._id)}
                    className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Check In
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-gray-950 rounded-lg shadow border dark:border-gray-800 mt-4 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left">Participant</th>
              <th className="px-6 py-3 text-left">QR Code</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-gray-800">
            {registrations.map((reg) => (
              <tr key={reg._id}>
                <td className="px-6 py-4">
                  <p className="font-medium">{reg.user.name}</p>
                  <p className="text-sm text-gray-500">{reg.user.email}</p>
                </td>

                <td className="px-6 py-4 text-xs font-mono">
                  {reg.qrCode.substring(0, 25)}...
                </td>

                <td className="px-6 py-4">
                  {reg.checkIn ? (
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Checked In
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                      Not Checked In
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {!reg.checkIn && (
                    <button
                      onClick={() => handleCheckIn(reg._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      Check In
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="md:hidden space-y-4 mt-4">
        {registrations.map((reg) => (
          <div
            key={reg._id}
            className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow border dark:border-gray-800"
          >
            <p className="text-lg font-semibold">{reg.user.name}</p>
            <p className="text-sm text-gray-500">{reg.user.email}</p>

            <p className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {reg.qrCode.substring(0, 30)}...
            </p>

            <div className="mt-3 flex items-center justify-between">
              {reg.checkIn ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Checked In
                </span>
              ) : (
                <button
                  onClick={() => handleCheckIn(reg._id)}
                  className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm"
                >
                  Check In
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
