import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { usePageContext } from "../../context/PageContext.jsx";

export default function RegisterPage() {
  const { register, loading } = useAuthContext();
  const { navigate } = usePageContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("participant");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "admin") {
      setError("Admin registration is not allowed.");
      return;
    }

    const success = await register(name, email, password, role);
    if (!success) setError("Failed to register. User might exist.");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gray-100 dark:bg-gray-900">

      {/* ✅ Back Button */}
      <button
        onClick={() => navigate("landing")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 
        bg-white dark:bg-gray-800 border dark:border-gray-700 
        text-gray-700 dark:text-gray-200 rounded-lg shadow-md
        hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* ✅ Register Card */}
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white dark:bg-gray-950 
      rounded-xl shadow-xl border dark:border-gray-800">

        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
          Create Account
        </h1>

        {error && (
          <p className="text-red-500 text-center text-sm sm:text-base">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 rounded-md shadow-sm
              text-sm sm:text-base"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 rounded-md shadow-sm
              text-sm sm:text-base"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 rounded-md shadow-sm
              text-sm sm:text-base"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium">Register as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 rounded-md shadow-sm
              text-sm sm:text-base"
            >
              <option value="participant">Participant</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium text-white 
            text-sm sm:text-lg bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("login")}
            className="font-medium text-indigo-600 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
