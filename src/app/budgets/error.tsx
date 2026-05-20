"use client";
import React from 'react';

import { useEffect } from "react";

export default function BudgetsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Budgets page error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f11",
        color: "#f1f1f1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1f",
          border: "1px solid #2a2a35",
          borderRadius: "16px",
          padding: "3rem 2.5rem",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem auto",
            fontSize: "2rem",
          }}
        >
          ⚠️
        </div>

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#f1f1f1",
            marginBottom: "0.75rem",
            margin: "0 0 0.75rem 0",
          }}
        >
          Something went wrong
        </h2>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            marginBottom: "0.5rem",
            margin: "0 0 0.5rem 0",
          }}
        >
          We encountered an error while loading your budgets dashboard.
        </p>

        {error?.message && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "0.8rem",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "8px",
              padding: "0.6rem 1rem",
              marginTop: "1rem",
              marginBottom: "0",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {error.message}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "2rem",
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
              padding: "0.65rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#ea6c0a";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#f97316";
            }}
          >
            Try Again
          </button>

          <a
            href="/"
            style={{
              backgroundColor: "transparent",
              color: "#9ca3af",
              border: "1px solid #2a2a35",
              borderRadius: "8px",
              padding: "0.65rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.target as HTMLAnchorElement;
              el.style.borderColor = "#f97316";
              el.style.color = "#f97316";
            }}
            onMouseLeave={(e) => {
              const el = e.target as HTMLAnchorElement;
              el.style.borderColor = "#2a2a35";
              el.style.color = "#9ca3af";
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}