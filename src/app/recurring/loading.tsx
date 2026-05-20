import React from 'react';

export default function RecurringLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-72 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-40 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-10 w-36 bg-[#f97316]/20 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 w-24 bg-white/10 rounded mb-3" />
              <div className="h-7 w-16 bg-white/10 rounded" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-white/10 bg-white/5">
            {["Title", "Category", "Amount", "Frequency", "Next Due", "Actions"].map((col) => (
              <div key={col} className="h-4 bg-white/10 rounded animate-pulse" />
            ))}
          </div>

          {/* Table rows */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 px-6 py-5 border-b border-white/5 last:border-0"
            >
              {/* Title */}
              <div className="flex flex-col gap-2">
                <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
              </div>
              {/* Category */}
              <div className="flex items-center">
                <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
              </div>
              {/* Amount */}
              <div className="flex items-center">
                <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
              </div>
              {/* Frequency */}
              <div className="flex items-center">
                <div className="h-6 w-20 bg-[#f97316]/10 rounded-full animate-pulse" />
              </div>
              {/* Next Due */}
              <div className="flex items-center">
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom pulse indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 text-white/30 text-sm">
            <div className="w-2 h-2 rounded-full bg-[#f97316] animate-ping" />
            <span>Loading recurring expenses...</span>
          </div>
        </div>
      </div>
    </div>
  );
}