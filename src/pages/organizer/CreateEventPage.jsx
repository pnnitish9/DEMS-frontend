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

  const [location, setLocation] = useState("");      // ✅ NEW
  const [poster, setPoster] = useState("");          // ✅ NEW (image url)

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ok = await createEvent({
      title,
      description,
      date,
      category,
      location,     // ✅ NEW FIELD SENT TO BACKEND
      poster,       // ✅ NEW FIELD SENT TO BACKEND
      isPaid: false,
      price: 0,
    });

    setLoading(false);
    if (ok) navigate("organizer-dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

      <form
        onSubmit={submit}
        className="p-8 bg-white dark:bg-gray-950 rounded-lg shadow border dark:border-gray-800 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Event Title</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            rows="4"
            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* ✅ Venue / Location */}
        <div>
          <label className="block text-sm font-medium">Event Venue / Location</label>
          <input
            type="text"
            placeholder="Ex: Delhi Auditorium, Block A"
            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-md"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* ✅ Poster Image URL */}
        <div>
          <label className="block text-sm font-medium">Poster Image URL</label>
          <input
            type="text"
            placeholder="Paste an image URL"
            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-md"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium">Date & Time</label>
            <input
              type="datetime-local"
              className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-md"
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

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}
