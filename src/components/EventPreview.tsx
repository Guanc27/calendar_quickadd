"use client";

import type { ParsedEvent } from "@/lib/types";

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) return "Today";
  if (eventDate.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function EventPreview({ parsed }: { parsed: ParsedEvent }) {
  if (!parsed.startTime) {
    return (
      <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
        Try adding a time, e.g. &quot;3pm tomorrow&quot;
      </p>
    );
  }

  return (
    <div
      className="mt-4 text-sm space-y-1 transition-opacity"
      style={{ color: "var(--text-muted)" }}
    >
      {parsed.title && (
        <div>
          <span className="inline-block w-16 text-xs uppercase tracking-wider opacity-60">
            Event
          </span>
          <span style={{ color: "var(--text-primary)" }}>{parsed.title}</span>
        </div>
      )}
      {parsed.date && (
        <div>
          <span className="inline-block w-16 text-xs uppercase tracking-wider opacity-60">
            Date
          </span>
          <span>{formatDate(parsed.date)}</span>
        </div>
      )}
      {parsed.startTime && parsed.endTime && (
        <div>
          <span className="inline-block w-16 text-xs uppercase tracking-wider opacity-60">
            Time
          </span>
          <span>
            {formatTime(parsed.startTime)} &ndash; {formatTime(parsed.endTime)}
          </span>
        </div>
      )}
    </div>
  );
}
