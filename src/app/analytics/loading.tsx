import React from 'react';

export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-white/5 rounded-lg animate-pulse" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse"
            >
              <div className="h-3 w-24 bg-white/10 rounded mb-3" />
              <div className="h-7 w-32 bg-white/15 rounded mb-2" />
              <div className="h-3 w-16 bg-white/10 rounded" />
            </div>
          ))}
        </div>

        {/* Charts row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Donut chart skeleton */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="h-5 w-40 bg-white/10 rounded mb-6" />
            <div className="flex items-center justify-center gap-8">
              <div className="w-48 h-48 rounded-full bg-white/10 relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#0f0f11]" />
              </div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                    <div className="h-3 w-12 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line chart skeleton */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="h-5 w-48 bg-white/10 rounded mb-6" />
            <div className="h-48 bg-white/5 rounded-lg relative overflow-hidden">
              {/* Fake grid lines */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-white/5"
                  style={{ top: `${(i + 1) * 25}%` }}
                />
              ))}
              {/* Fake line */}
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                viewBox="0 0 300 150"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,120 50,90 100,100 150,60 200,75 250,40 300,55"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex justify-between mt-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 w-8 bg-white/10 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top expenses skeleton */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="h-5 w-44 bg-white/10 rounded mb-5" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <div>
                      <div className="h-3 w-28 bg-white/10 rounded mb-1.5" />
                      <div className="h-2.5 w-16 bg-white/5 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Month-over-month table skeleton */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="h-5 w-52 bg-white/10 rounded mb-5" />
            {/* Table header */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 bg-white/10 rounded" />
              ))}
            </div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 py-2 border-t border-white/5">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="h-3 bg-white/10 rounded"
                      style={{ opacity: 1 - j * 0.15 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}