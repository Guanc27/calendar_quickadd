import { google } from "googleapis";

interface CreateEventParams {
  accessToken: string;
  title: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  timeZone: string;
}

export async function createCalendarEvent({
  accessToken,
  title,
  startTime,
  endTime,
  timeZone,
}: CreateEventParams) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      start: { dateTime: startTime, timeZone },
      end: { dateTime: endTime, timeZone },
    },
  });

  return event.data;
}
