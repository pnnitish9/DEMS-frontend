import React, { useState } from "react";
import useData from "../../hooks/useData";
import { usePageContext } from "../../context/PageContext";

export default function CreateEventPage() {
  const { dataActions } = useData();
  const { createEvent } = dataActions;
  const { navigate } = usePageContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Workshop");

  const [location, setLocation] = useState("");
  const [poster, setPoster] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ok = await createEvent({
      title,
      description,
      date,
      category,
      location,
      poster,
      isPaid: false,
      price: 0,
    });

    setLoading(false);

    if (ok) navigate("organizer-dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        Create New Event
      </h1>

      <form
        onSubmit={submit}
        className="p-6 sm:p-8 bg-white dark:bg-gray-950 rounded-xl shadow border dark:border-gray-800 space-y-6"
      >
        {/* ✅ TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* ✅ DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows="4"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* ✅ LOCATION */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Venue / Location</label>
          <input
            type="text"
            placeholder="Ex: Delhi Auditorium, Block A"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* ✅ POSTER URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Poster Image URL</label>
          <input
            type="text"
            placeholder="Paste an image URL"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
            required
          />

          {/* ✅ LIVE POSTER PREVIEW */}
          {poster && (
            <div className="mt-3">
              <img
                src={poster}
                alt="Poster Preview"
                className="w-full max-h-64 object-cover rounded-lg border dark:border-gray-700"
              />
            </div>
          )}
        </div>

        {/* ✅ TWO GRID FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ✅ DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* ✅ CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Hackathon</option>
              <option>Cultural Fest</option>
              <option>Technology</option>
            </select>
          </div>
        </div>

        {/* ✅ SUBMIT */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}
