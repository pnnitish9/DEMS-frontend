import React, { useState, useEffect } from "react";
import { User, Users, Shield, LogIn, ArrowLeft } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { usePageContext } from "../../context/PageContext.jsx";

export default function LoginPage() {
  const { login, loading } = useAuthContext();
  const { navigate } = usePageContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("participant");
  const [error, setError] = useState("");

  // ✅ Auto-fill demo accounts based on type
  useEffect(() => {
    if (loginType === "admin") {
      setEmail("");
      setPassword("");
    } else {
      setEmail("");
      setPassword("");
    }
  }, [loginType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password.");
    }
  };

  const LoginTypeButton = ({ type, label, icon: Icon }) => (
    <button
      type="button"
      onClick={() => setLoginType(type)}
      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all 
      flex items-center justify-center gap-2 text-sm sm:text-base
      ${
        loginType === type
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gray-100 dark:bg-gray-900 relative">

      {/* ✅ Back Button (Landing Page) */}
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

      {/* ✅ Login Card */}
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white dark:bg-gray-950 
      rounded-xl shadow-xl border dark:border-gray-800">

        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
          DEMP Login
        </h1>

        {/* Login Type Selector */}
        <div className="flex flex-col sm:flex-row gap-2">
          <LoginTypeButton type="participant" label="Participant" icon={User} />
          <LoginTypeButton type="organizer" label="Organizer" icon={Users} />
          <LoginTypeButton type="admin" label="Admin" icon={Shield} />
        </div>

        {error && <p className="text-red-500 text-center text-sm sm:text-base">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium text-white text-sm sm:text-lg
            bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Login
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm">
          No account?{" "}
          <button
            onClick={() => navigate("register")}
            className="font-medium text-indigo-600 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
