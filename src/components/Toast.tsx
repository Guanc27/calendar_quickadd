"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}

export default function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const color = type === "success" ? "var(--success)" : "var(--error)";

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm px-4 py-2 rounded-sm animate-[fadeIn_0.2s_ease-in]"
      style={{
        color,
        backgroundColor: "var(--bg)",
        border: `1px solid ${color}`,
      }}
    >
      {message}
    </div>
  );
}
