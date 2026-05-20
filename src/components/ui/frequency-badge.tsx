import React from 'react';
import { Frequency } from "@/types/index";

interface FrequencyBadgeProps {
  frequency: Frequency;
  className?: string;
}

const frequencyConfig: Record<
  Frequency,
  { label: string; color: string; bg: string; border: string }
> = {
  WEEKLY: {
    label: "Weekly",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  MONTHLY: {
    label: "Monthly",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
  },
  YEARLY: {
    label: "Yearly",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
  },
};

export function FrequencyBadge({ frequency, className = "" }: FrequencyBadgeProps) {
  const config = frequencyConfig[frequency];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        border ${config.bg} ${config.color} ${config.border}
        transition-all duration-200
        ${className}
      `}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.color.replace("text-", "bg-")}`}
        />
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.color.replace("text-", "bg-")}`}
        />
      </span>
      {config.label}
    </span>
  );
}

export default FrequencyBadge;