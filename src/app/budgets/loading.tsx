import React from 'react';

export default function BudgetsLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-72 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Month Selector Skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-9 w-9 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 w-24 bg-white/10 rounded mb-3" />
              <div className="h-7 w-32 bg-white/10 rounded" />
            </div>
          ))}
        </div>

        {/* Budget Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div>
                    <div className="h-5 w-28 bg-white/10 rounded mb-1" />
                    <div className="h-3 w-20 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-white/10 rounded-lg" />
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <div className="h-3 w-20 bg-white/10 rounded" />
                  <div className="h-3 w-16 bg-white/10 rounded" />
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/20 rounded-full animate-pulse"
                    style={{ width: `${30 + i * 10}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex justify-between">
                <div>
                  <div className="h-3 w-12 bg-white/5 rounded mb-1" />
                  <div className="h-5 w-20 bg-white/10 rounded" />
                </div>
                <div>
                  <div className="h-3 w-12 bg-white/5 rounded mb-1" />
                  <div className="h-5 w-20 bg-white/10 rounded" />
                </div>
                <div>
                  <div className="h-3 w-16 bg-white/5 rounded mb-1" />
                  <div className="h-5 w-20 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pulse overlay shimmer effect */}
        <style jsx>{`
          @keyframes shimmer {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </div>
  );
}