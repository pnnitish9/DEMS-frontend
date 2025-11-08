import React, { useState } from "react";

import LandingPage from "./pages/LandingPage.jsx";

// Contexts
import { useAuthContext } from "./context/AuthContext.jsx";
import { useThemeContext } from "./context/ThemeContext.jsx";
import { usePageContext } from "./context/PageContext.jsx";

// Layout Components
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

export default function App() {
  const { currentUser, authReady } = useAuthContext();
  const { currentPage, navigate } = usePageContext();   // ✅ FIXED: added navigate
  const { isDarkMode } = useThemeContext();

  // ✅ Sidebar state (mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Show loader while checking token
  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  // ✅ Auto-redirect logged-in users from landing page to their dashboard
  if (currentUser && currentPage === "landing") {
    if (currentUser.role === "admin") navigate("admin-dashboard");
    else if (currentUser.role === "organizer") navigate("organizer-dashboard");
    else navigate("participant-dashboard");
  }

  // ✅ Main Page Routing
  const renderPage = () => {
    // ✅ PUBLIC PAGES (not logged in)
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

    // ✅ PRIVATE PAGES (logged in)
    switch (currentPage) {
      case "landing":
        return <LandingPage />;

      // Participant
      case "participant-dashboard":
        return <ParticipantDashboard />;
      case "event-details":
        return <EventDetailsPage />;
      case "my-registrations":
        return <MyRegistrationsPage />;

      // Organizer
      case "organizer-dashboard":
        return <OrganizerDashboard />;
      case "create-event":
        return <CreateEventPage />;
      case "manage-participants":
        return <ManageParticipantsPage />;

      // Admin
      case "admin-dashboard":
        return <AdminDashboard />;
      case "manage-events":
        return <ManageEventsPage />;
      case "manage-users":
        return <ManageUsersPage />;

      // Common Pages
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;

      // ✅ Fallback routing
      default:
        if (currentUser.role === "admin") return <AdminDashboard />;
        if (currentUser.role === "organizer") return <OrganizerDashboard />;
        return <ParticipantDashboard />;
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDarkMode ? "dark" : ""}`}>

      {/* ✅ Sidebar */}
      {currentUser && (
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ✅ Main Wrapper */}
      <div className="flex-1 flex flex-col">

        {/* ✅ Header */}
        {currentUser && (
          <Header openSidebar={() => setIsSidebarOpen(true)} />
        )}

        {/* ✅ Page */}
        <main
          className={`flex-1 p-6 lg:p-10 bg-gray-100 dark:bg-gray-900 ${
            currentUser ? "lg:ml-64" : ""
          }`}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
