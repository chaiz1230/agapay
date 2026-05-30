/**
 * Returns a valid, persistent Google Meet room URL.
 * 
 * NOTE: Google Meet does not allow generating random codes (they will return a "Check your meeting code" error).
 * To ensure the video call is fully functional, we use a real, persistent Google Calendar-scheduled Meet link.
 * Both doctor and patient will join this same room for the demo.
 * 
 * Replace the URL below with your own Google Calendar Meet link if desired.
 */
export function getMeetUrl(apptId?: string): string {
  // Return a real, persistent Google Meet room link
  return "https://meet.google.com/wix-jygv-yxt";
}
