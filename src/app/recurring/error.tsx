"use client";
import React from 'react';

import { useEffect } from "react";

export default function RecurringError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Recurring page error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f11",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1f",
          border: "1px solid #2a2a35",
          borderRadius: "12px",
          padding: "2.5rem",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: "rgba(249, 115, 22, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2
          style={{
            color: "#ffffff",
            fontSize: "1.375rem",
            fontWeight: "700",
            marginBottom: "0.75rem",
            margin: "0 0 0.75rem 0",
          }}
        >
          Something went wrong
        </h2>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.9375rem",
            lineHeight: "1.6",
            marginBottom: "0.5rem",
            margin: "0 0 0.5rem 0",
          }}
        >
          We encountered an error loading your recurring expenses.
        </p>

        {error?.message && (
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.8125rem",
              backgroundColor: "#111115",
              border: "1px solid #2a2a35",
              borderRadius: "6px",
              padding: "0.625rem 0.875rem",
              marginTop: "1rem",
              marginBottom: "0",
              wordBreak: "break-word",
              textAlign: "left",
            }}
          >
            {error.message}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "1.75rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={reset}
            style={{
              backgroundColor: "#f97316",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "0.625rem 1.5rem",
              fontSize: "0.9375rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#ea6c0a";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#f97316";
            }}
          >
            Try Again
          </button>

          <a
            href="/recurring"
            style={{
              backgroundColor: "transparent",
              color: "#9ca3af",
              border: "1px solid #2a2a35",
              borderRadius: "8px",
              padding: "0.625rem 1.5rem",
              fontSize: "0.9375rem",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "#f97316";
              el.style.color = "#f97316";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "#2a2a35";
              el.style.color = "#9ca3af";
            }}
          >
            Reload Page
          </a>
        </div>
      </div>
    </div>
  );
}