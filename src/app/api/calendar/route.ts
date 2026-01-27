import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCalendarEvent } from "@/lib/google-calendar";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { title, startTime, endTime, timeZone } = body;

  if (!title || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const event = await createCalendarEvent({
      accessToken: session.accessToken,
      title,
      startTime,
      endTime,
      timeZone: timeZone || "America/Chicago",
    });

    return NextResponse.json({
      success: true,
      eventId: event.id,
      htmlLink: event.htmlLink,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
