import React from 'react';

interface BudgetProgressBarProps {
  spent: number;
  limit: number;
  showLabels?: boolean;
  compact?: boolean;
}

export default function BudgetProgressBar({
  spent,
  limit,
  showLabels = true,
  compact = false,
}: BudgetProgressBarProps) {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const overBudget = limit > 0 && spent > limit;
  const overPercentage = limit > 0 ? ((spent / limit) * 100).toFixed(1) : "0";

  const getBarColor = () => {
    if (limit === 0) return "bg-gray-500";
    const ratio = spent / limit;
    if (ratio >= 1) return "bg-red-500";
    if (ratio >= 0.75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getTextColor = () => {
    if (limit === 0) return "text-gray-400";
    const ratio = spent / limit;
    if (ratio >= 1) return "text-red-400";
    if (ratio >= 0.75) return "text-yellow-400";
    return "text-green-400";
  };

  const getTrackColor = () => {
    if (limit === 0) return "bg-gray-700";
    const ratio = spent / limit;
    if (ratio >= 1) return "bg-red-900/30";
    if (ratio >= 0.75) return "bg-yellow-900/30";
    return "bg-green-900/30";
  };

  const getGlowColor = () => {
    if (limit === 0) return "";
    const ratio = spent / limit;
    if (ratio >= 1) return "shadow-red-500/30";
    if (ratio >= 0.75) return "shadow-yellow-500/30";
    return "shadow-green-500/30";
  };

  const barHeight = compact ? "h-2" : "h-3";

  return (
    <div className="w-full">
      {showLabels && !compact && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-medium">
            ${spent.toFixed(2)} spent
          </span>
          <span className={`text-xs font-semibold ${getTextColor()}`}>
            {overBudget ? (
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {overPercentage}% over budget
              </span>
            ) : (
              `${percentage.toFixed(1)}%`
            )}
          </span>
        </div>
      )}

      <div
        className={`w-full ${barHeight} rounded-full ${getTrackColor()} overflow-hidden relative`}
      >
        {/* Background shimmer effect */}
        <div
          className={`${barHeight} rounded-full ${getBarColor()} transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Over-budget indicator stripes */}
        {overBudget && (
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
            }}
          />
        )}
      </div>

      {showLabels && !compact && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-gray-500">
            {limit > 0 ? (
              overBudget ? (
                <span className="text-red-400 font-medium">
                  ${(spent - limit).toFixed(2)} over limit
                </span>
              ) : (
                <span className="text-gray-400">
                  ${(limit - spent).toFixed(2)} remaining
                </span>
              )
            ) : (
              <span className="text-gray-500 italic">No budget set</span>
            )}
          </span>
          <span className="text-xs text-gray-500">
            Limit: ${limit.toFixed(2)}
          </span>
        </div>
      )}

      {compact && showLabels && (
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs font-medium ${getTextColor()}`}>
            {overBudget ? `${overPercentage}%` : `${percentage.toFixed(0)}%`}
          </span>
        </div>
      )}
    </div>
  );
}