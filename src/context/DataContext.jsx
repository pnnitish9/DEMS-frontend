import React, { createContext, useContext } from "react";
import { api } from "../api/api";

const DataContext = createContext();
export const useDataContext = () => useContext(DataContext);

export function DataContextProvider({ children, notify }) {

  /* ===========================
     ✅ Organizer → Create Event
     =========================== */
  const createEvent = async (eventData) => {
    try {
      await api.post("/events", eventData);
      notify?.("Event Submitted", `"${eventData.title}" is pending approval.`);
      return true;
    } catch (error) {
      notify?.("Error", "Failed to create event.", "error");
      return false;
    }
  };

  /* ===============================================
     ✅ Admin → Approve / Unlist an Event
     =============================================== */
  const approveEvent = async (eventId, shouldApprove) => {
    try {
      const { data: event } = await api.put(
        `/admin/events/approve/${eventId}`,
        { isApproved: shouldApprove }
      );

      notify?.(
        shouldApprove ? "Event Approved" : "Event Unlisted",
        `"${event.title}" is now ${shouldApprove ? "approved" : "unlisted"}.`
      );

      return true;
    } catch (error) {
      notify?.("Error", "Failed to update event status.", "error");
      return false;
    }
  };

  /* ===============================
     ✅ Participant → Register Event
     =============================== */
  const registerForEvent = async (eventId) => {
    try {
      const { data: reg } = await api.post("/registrations", { eventId });

      const event = (await api.get(`/events/${reg.event}`)).data;

      notify?.("Registration Confirmed!", `You registered for "${event.title}".`);

      return reg; // ✅ return full registration object
    } catch (error) {
      notify?.(
        "Registration Failed",
        error.response?.data?.message || "Could not register.",
        "error"
      );
      return null;
    }
  };

  /* ===============================
     ✅ Organizer → Check-in
     =============================== */
  const checkInParticipant = async (registrationId) => {
    try {
      await api.put(`/registrations/checkin/${registrationId}`);

      notify?.("Check-in Successful", "Participant has been checked in.");

      return true;
    } catch (error) {
      notify?.(
        "Check-in Failed",
        error.response?.data?.message || "Could not check in participant.",
        "error"
      );
      return false;
    }
  };

  /* ===============================
     ✅ Organizer → Cancel Event
     =============================== */
  const cancelEvent = async (eventId, reason) => {
    try {
      await api.put(`/events/cancel/${eventId}`, { reason });

      notify?.("Event Cancelled", "Participants will see your cancellation reason.");

      return true;
    } catch (error) {
      notify?.(
        "Cancel Failed",
        error.response?.data?.message || "Could not cancel event.",
        "error"
      );
      return false;
    }
  };

  /* ✅ EVERYTHING exported cleanly */
  return (
    <DataContext.Provider
      value={{
        createEvent,
        approveEvent,
        registerForEvent,
        checkInParticipant,
        cancelEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
