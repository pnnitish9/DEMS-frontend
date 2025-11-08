import React, { useEffect, useState } from "react";
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

  // ✅ Scanner state
  const [scannerOpen, setScannerOpen] = useState(false);

  // ✅ Search Check-In state
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  /* ✅ Load event + registrations */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [eventRes, regsRes] = await Promise.all([
          api.get(`/events/${eventId}`),
          api.get(`/registrations/event/${eventId}`)
        ]);

        setEvent(eventRes.data);
        setRegistrations(regsRes.data);

      } catch (err) {
        console.error("Failed to load participants:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) load();
  }, [eventId]);

  /* ✅ Refresh table after check-in */
  const refreshTable = async () => {
    const { data } = await api.get(`/registrations/event/${eventId}`);
    setRegistrations(data);
  };

  /* ✅ Manual Check-In Button */
  const handleCheckIn = async (regId) => {
    const ok = await checkInParticipant(regId);
    if (ok) {
      toast.success("✅ Successfully Checked In");
      refreshTable();
    }
  };

  /* ✅ Email/Name search check-in */
  const handleSearch = () => {
    const query = searchText.trim().toLowerCase();

    if (!query) return setSearchResults([]);

    const results = registrations.filter((reg) => {
      const name = reg.user.name.toLowerCase();
      const email = reg.user.email.toLowerCase();
      return name.includes(query) || email.includes(query);
    });

    setSearchResults(results);
  };

  /* ✅ QR Check-In handler */
  const handleQRScan = async (value) => {
    try {
      const parsed = JSON.parse(value);

      if (!parsed.registrationId)
        return toast.error("Invalid QR Code");

      const ok = await checkInParticipant(parsed.registrationId);

      if (ok) {
        toast.success("✅ QR Check-In Successful");
        refreshTable();
      }
    } catch (e) {
      toast.error("Invalid QR");
    }
  };

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Manage Participants</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{event.title}</p>

      {/* ✅ Check-in Methods */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        {/* ✅ QR Check In Button */}
        <button
          onClick={() => setScannerOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          📷 Scan QR
        </button>

        {/* ✅ Search Check-In */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Enter name or email"
            className="px-3 py-2 border dark:bg-gray-900 dark:border-gray-700 rounded-lg w-full"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={handleSearch}
          />
        </div>
      </div>

      {/* ✅ Search Result Dropdown */}
      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border dark:border-gray-700 mb-6">
          <h3 className="font-bold mb-2">Search Results</h3>

          <ul className="space-y-2">
            {searchResults.map((reg) => (
              <li
                key={reg._id}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{reg.user.name}</p>
                  <p className="text-sm text-gray-500">{reg.user.email}</p>
                </div>

                {reg.checkIn ? (
                  <span className="px-3 py-1 text-xs bg-green-200 text-green-800 rounded-full">
                    Checked In
                  </span>
                ) : (
                  <button
                    onClick={() => handleCheckIn(reg._id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    Check In
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ QR Scanner Popup */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-3">Scan QR Code</h2>

            <QRScanner onScan={handleQRScan} continuous={true} />

            <button
              onClick={() => setScannerOpen(false)}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}

      {/* ✅ Participants Table */}
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow border dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                Participant
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                QR Code
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-gray-800">
            {registrations.map((reg) => (
              <tr key={reg._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div className="font-medium">{reg.user.name}</div>
                  <div className="text-sm text-gray-500">{reg.user.email}</div>
                </td>

                <td className="px-6 py-4 font-mono text-xs">
                  {reg.qrCode.substring(0, 20)}...
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
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
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
    </div>
  );
}
