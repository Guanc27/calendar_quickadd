import * as chrono from "chrono-node";
import type { ParsedEvent } from "./types";

const DURATION_REGEX =
  /\b(\d+(?:\.\d+)?\s*(?:hours?|hrs?|h|minutes?|mins?|m))\b/gi;

function parseDurationMs(durationStr: string): number | null {
  const normalized = durationStr.toLowerCase().replace(/\s+/g, "");
  const hourMatch = normalized.match(/^(\d+(?:\.\d+)?)(hours?|hrs?|h)$/);
  if (hourMatch) return parseFloat(hourMatch[1]) * 3600000;
  const minMatch = normalized.match(/^(\d+(?:\.\d+)?)(minutes?|mins?|m)$/);
  if (minMatch) return parseFloat(minMatch[1]) * 60000;
  return null;
}

export function parseEventInput(
  input: string,
  referenceDate?: Date,
): ParsedEvent {
  const ref = referenceDate ?? new Date();
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      title: "",
      date: null,
      startTime: null,
      endTime: null,
      durationMs: null,
      isValid: false,
      rawText: input,
    };
  }

  // 1. Parse date/time with chrono
  const chronoResults = chrono.parse(trimmed, ref);

  // 2. Parse duration
  const durationMatches = [...trimmed.matchAll(DURATION_REGEX)];
  let durationMs: number | null = null;
  const durationTexts: string[] = [];

  for (const match of durationMatches) {
    const parsed = parseDurationMs(match[0]);
    if (parsed && parsed > 0) {
      durationMs = (durationMs ?? 0) + parsed;
      durationTexts.push(match[0]);
    }
  }

  // 3. Extract title by removing chrono matches and duration text
  let title = trimmed;

  for (const dt of durationTexts) {
    const idx = title.indexOf(dt);
    if (idx !== -1) {
      title = title.slice(0, idx) + title.slice(idx + dt.length);
    }
  }

  for (const r of chronoResults) {
    title = title.replace(r.text, "");
  }

  title = title.replace(/\s+/g, " ").trim();

  // 4. Determine start and end times
  let startTime: Date | null = null;
  let endTime: Date | null = null;
  let date: Date | null = null;

  if (chronoResults.length > 0) {
    const result = chronoResults[0];
    startTime = result.start.date();
    date = new Date(startTime);
    date.setHours(0, 0, 0, 0);

    if (result.end) {
      endTime = result.end.date();
    } else if (durationMs) {
      endTime = new Date(startTime.getTime() + durationMs);
    } else {
      // Default: 1 hour
      durationMs = 3600000;
      endTime = new Date(startTime.getTime() + 3600000);
    }
  }

  const isValid = !!(title && startTime && endTime);

  return { title, date, startTime, endTime, durationMs, isValid, rawText: input };
}
