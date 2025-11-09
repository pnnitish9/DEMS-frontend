import React, { useState, useEffect } from "react";

import LandingPage from "./pages/LandingPage.jsx";

// Contexts
import { useAuthContext } from "./context/AuthContext.jsx";
import { useThemeContext } from "./context/ThemeContext.jsx";
import { usePageContext } from "./context/PageContext.jsx";

// Layout
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

// Participant Pages
import ParticipantDashboard from "./pages/participant/ParticipantDashboard.jsx";
import EventDetailsPage from "./pages/participant/EventDetailsPage.jsx";
import MyRegistrationsPage from "./pages/participant/MyRegistrationsPage.jsx";

// Organizer Pages
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard.jsx";
import CreateEventPage from "./pages/organizer/CreateEventPage.jsx";
import ManageParticipantsPage from "./pages/organizer/ManageParticipantsPage.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageEventsPage from "./pages/admin/ManageEventsPage.jsx";
import ManageUsersPage from "./pages/admin/ManageUsersPage.jsx";

// Common Pages
import ProfilePage from "./pages/common/ProfilePage.jsx";
import SettingsPage from "./pages/common/SettingsPage.jsx";

// ✅ Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const { currentUser, authReady } = useAuthContext();
  const { currentPage, navigate } = usePageContext();
  const { isDarkMode } = useThemeContext();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ✅ FIXED: Redirect moved out of render */
  useEffect(() => {
    if (currentUser && currentPage === "landing") {
      if (currentUser.role === "admin") navigate("admin-dashboard");
      else if (currentUser.role === "organizer") navigate("organizer-dashboard");
      else navigate("participant-dashboard");
    }
  }, [currentUser, currentPage]);

  /* ✅ Show loader while checking token */
  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  /* ✅ Page Routing Helper */
  const renderPage = () => {
    if (!currentUser) {
      switch (currentPage) {
        case "landing":
          return <LandingPage />;
        case "login":
          return <LoginPage />;
        case "register":
          return <RegisterPage />;
        default:
          return <LandingPage />;
      }
    }

    switch (currentPage) {
      case "landing":
        return <LandingPage />;

      // ✅ Participant
      case "participant-dashboard":
        return <ParticipantDashboard />;
      case "event-details":
        return <EventDetailsPage />;
      case "my-registrations":
        return <MyRegistrationsPage />;

      // ✅ Organizer
      case "organizer-dashboard":
        return <OrganizerDashboard />;
      case "create-event":
        return <CreateEventPage />;
      case "manage-participants":
        return <ManageParticipantsPage />;

      // ✅ Admin
      case "admin-dashboard":
        return <AdminDashboard />;
      case "manage-events":
        return <ManageEventsPage />;
      case "manage-users":
        return <ManageUsersPage />;

      // ✅ Common
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;

      // ✅ Fallback
      default:
        if (currentUser.role === "admin") return <AdminDashboard />;
        if (currentUser.role === "organizer") return <OrganizerDashboard />;
        return <ParticipantDashboard />;
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDarkMode ? "dark" : ""}`}>

      {/* ✅ Sidebar (except participant) */}
      {currentUser && currentUser.role !== "participant" && (
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ✅ Main Layout */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        {currentUser && (
          <Header openSidebar={() => setIsSidebarOpen(true)} />
        )}

        {/* Page Content */}
        <main
          className={`flex-1 p-6 lg:p-10 bg-gray-100 dark:bg-gray-900 ${
            currentUser && currentUser.role !== "participant" ? "lg:ml-64" : ""
          }`}
        >
          {renderPage()}
        </main>
      </div>

      {/* ✅ Global Toast */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </div>
  );
}
