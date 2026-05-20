"use client";
import React from 'react';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/categories", label: "Categories" },
  { href: "/recurring", label: "Recurring" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{ backgroundColor: "#0f0f11" }}
      className="border-b border-gray-800 sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Expense<span className="text-orange-500">Tracker</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "text-orange-500 bg-orange-500/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden flex items-center">
            <MobileMenu pathname={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {navLinks.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200
              ${
                isActive
                  ? "text-orange-500 bg-orange-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}