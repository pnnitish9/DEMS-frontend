import { api } from "../api/api";

export default function useData(notify) {
  const dataActions = {
    // ✅ Organizer → create new event
    createEvent: async (eventData) => {
      try {
        await api.post("/events", eventData);

        notify?.(
          "Event Submitted",
          `"${eventData.title}" is pending approval.`
        );

        return true;
      } catch (error) {
        notify?.("Error", "Failed to create event.", "error");
        return false;
      }
    },

    // ✅ Admin → approve / unlist event
    approveEvent: async (eventId, shouldApprove) => {
      try {
        console.log(`Sending request to approve event ${eventId} with status:`, shouldApprove);
        const { data: event } = await api.put(
          `/admin/events/approve/${eventId}`,
          { isApproved: shouldApprove },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Server response:', event);
        
        if (event) {
          notify?.(
            shouldApprove ? "Event Approved" : "Event Unlisted",
            `"${event.title}" is now ${shouldApprove ? "approved" : "unlisted"}.`
          );
          return true;
        } else {
          throw new Error('No event data returned from server');
        }
      } catch (error) {
        console.error('Error in approveEvent:', error);
        notify?.(
          "Error", 
          error.response?.data?.message || "Failed to update event status.", 
          "error"
        );
        return false;
      }
    },

    // ✅ Participant → register for event
    registerForEvent: async (eventId) => {
      try {
        const { data: reg } = await api.post("/registrations", { eventId });

        const event = (await api.get(`/events/${reg.event}`)).data;

        notify?.(
          "Registration Confirmed!",
          `You are registered for "${event.title}".`
        );

        return true;
      } catch (error) {
        notify?.(
          "Registration Failed",
          error.response?.data?.message || "Could not register.",
          "error"
        );
        return false;
      }
    },

    // ✅ Organizer → check-in a participant
    checkInParticipant: async (registrationId) => {
      try {
        await api.put(`/registrations/checkin/${registrationId}`);

        notify?.(
          "Check-in Successful",
          "Participant has been checked in."
        );

        return true;
      } catch (error) {
        notify?.(
          "Check-in Failed",
          "Could not check in participant.",
          "error"
        );
        return false;
      }
    },
  };

  return { dataActions };
}
