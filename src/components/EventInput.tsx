"use client";

import { useState, useMemo, useCallback } from "react";
import { parseEventInput } from "@/lib/parse-event";
import EventPreview from "./EventPreview";
import Toast from "./Toast";

export default function EventInput() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const parsed = useMemo(() => parseEventInput(input), [input]);

  const handleSubmit = useCallback(async () => {
    if (!parsed.isValid || loading) return;

    setLoading(true);
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: parsed.title,
          startTime: parsed.startTime!.toISOString(),
          endTime: parsed.endTime!.toISOString(),
          timeZone,
        }),
      });

      if (res.status === 401) {
        window.location.reload();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");

      setToast({ message: "Event added!", type: "success" });
      setInput("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [parsed, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && parsed.isValid && !loading) {
      handleSubmit();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="finish problem set 3pm 1hr tomorrow"
        autoFocus
        className="w-full bg-transparent border-0 border-b outline-none text-lg pb-2 placeholder:opacity-40 font-mono"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
      />

      {input.trim() && <EventPreview parsed={parsed} />}

      {parsed.isValid && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 text-sm uppercase tracking-[0.1em] pb-0.5 border-b transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            color: "var(--accent)",
            borderColor: "var(--accent)",
          }}
        >
          {loading ? "Adding..." : "Add to Google Calendar"}
        </button>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
