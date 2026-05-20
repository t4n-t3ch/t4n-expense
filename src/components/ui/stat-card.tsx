import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    percentage: number;
    direction: "up" | "down";
    label?: string;
  };
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  trend,
  icon,
  prefix,
  suffix,
  className = "",
}: StatCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === "number") {
      return val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return val;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    // Green for down (spending decreased = good), red for up (spending increased = bad)
    return trend.direction === "down"
      ? "text-emerald-400"
      : "text-red-400";
  };

  const getTrendBgColor = () => {
    if (!trend) return "";
    return trend.direction === "down"
      ? "bg-emerald-400/10"
      : "bg-red-400/10";
  };

  const TrendArrow = () => {
    if (!trend) return null;
    if (trend.direction === "up") {
      return (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"
        />
      </svg>
    );
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-white/[0.06]
        bg-[#18181b] shadow-xl
        transition-all duration-300 hover:border-white/[0.12] hover:shadow-2xl hover:-translate-y-0.5
        ${className}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      {/* Orange accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97316]/60 to-transparent" />

      <div className="relative p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-zinc-400 tracking-wide uppercase">
            {label}
          </p>
          {icon && (
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#f97316]/10 text-[#f97316]">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1 mb-3">
          {prefix && (
            <span className="text-lg font-semibold text-zinc-400">{prefix}</span>
          )}
          <span className="text-3xl font-bold text-white tracking-tight">
            {formatValue(value)}
          </span>
          {suffix && (
            <span className="text-lg font-semibold text-zinc-400">{suffix}</span>
          )}
        </div>

        {/* Trend indicator */}
        {trend && (
          <div className="flex items-center gap-2">
            <div
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
                ${getTrendColor()} ${getTrendBgColor()}
              `}
            >
              <TrendArrow />
              <span>{Math.abs(trend.percentage).toFixed(1)}%</span>
            </div>
            {trend.label && (
              <span className="text-xs text-zinc-500">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}