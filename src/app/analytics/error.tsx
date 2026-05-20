"use client";
import React from 'react';

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnalyticsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Analytics error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f11",
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
          border: "1px solid #2a2a30",
          borderRadius: "16px",
          padding: "3rem",
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
            backgroundColor: "rgba(249, 115, 22, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2rem",
          }}
        >
          ⚠️
        </div>

        <h1
          style={{
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "0.75rem",
            margin: "0 0 0.75rem 0",
          }}
        >
          Analytics Unavailable
        </h1>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            marginBottom: "0.5rem",
            margin: "0 0 0.5rem 0",
          }}
        >
          Something went wrong while loading your spending analytics.
        </p>

        {error?.message && (
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.8rem",
              backgroundColor: "#0f0f11",
              border: "1px solid #2a2a30",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginTop: "1rem",
              marginBottom: "0",
              fontFamily: "monospace",
              wordBreak: "break-word",
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
              padding: "0.625rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
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
            href="/analytics"
            style={{
              backgroundColor: "transparent",
              color: "#9ca3af",
              border: "1px solid #2a2a30",
              borderRadius: "8px",
              padding: "0.625rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.target as HTMLAnchorElement;
              el.style.borderColor = "#f97316";
              el.style.color = "#f97316";
            }}
            onMouseLeave={(e) => {
              const el = e.target as HTMLAnchorElement;
              el.style.borderColor = "#2a2a30";
              el.style.color = "#9ca3af";
            }}
          >
            Reload Page
          </a>
        </div>

        <p
          style={{
            color: "#4b5563",
            fontSize: "0.75rem",
            marginTop: "1.5rem",
            marginBottom: "0",
          }}
        >
          If this problem persists, please check your connection and try again.
        </p>
      </div>
    </div>
  );
}