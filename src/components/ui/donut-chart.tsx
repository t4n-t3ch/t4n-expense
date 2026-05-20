"use client";
import React from 'react';

import { useState } from "react";

interface DonutChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartDataPoint[];
  size?: number;
  thickness?: number;
  currencySymbol?: string;
}

function formatCurrency(value: number, symbol = "$"): string {
  if (value >= 1000) {
    return `${symbol}${(value / 1000).toFixed(1)}k`;
  }
  return `${symbol}${value.toFixed(2)}`;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function DonutChart({
  data,
  size = 220,
  thickness = 48,
  currencySymbol = "$",
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2 - 4;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="flex items-center justify-center rounded-full border-4 border-[#1e1e24]"
          style={{ width: size, height: size }}
        >
          <span className="text-[#6b7280] text-sm">No data</span>
        </div>
      </div>
    );
  }

  let cumulativeAngle = 0;
  const segments = data.map((d, i) => {
    const fraction = d.value / total;
    const sweepAngle = fraction * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sweepAngle;
    cumulativeAngle = endAngle;
    return { ...d, startAngle, endAngle, fraction, index: i };
  });

  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {/* Background circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#1e1e24"
            strokeWidth={thickness}
          />

          {/* Segments */}
          {segments.map((seg) => {
            const isHovered = hoveredIndex === seg.index;
            const segR = isHovered ? r + 4 : r;
            const segThickness = isHovered ? thickness + 4 : thickness;

            // Handle full circle edge case
            const sweep =
              seg.endAngle - seg.startAngle >= 360
                ? 359.999
                : seg.endAngle - seg.startAngle;
            const adjustedEnd = seg.startAngle + sweep;

            const d = describeArc(cx, cy, segR, seg.startAngle, adjustedEnd);

            return (
              <path
                key={seg.index}
                d={d}
                fill="none"
                stroke={seg.color}
                strokeWidth={segThickness}
                strokeLinecap="butt"
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 8px ${seg.color}88)`
                    : "none",
                  opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Center text */}
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[#9ca3af] text-xs"
            fontSize="12"
            fill="#9ca3af"
          >
            {hovered ? hovered.label : "Total"}
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fontWeight="700"
            fill={hovered ? hovered.color : "#f9fafb"}
          >
            {hovered
              ? formatCurrency(hovered.value, currencySymbol)
              : formatCurrency(total, currencySymbol)}
          </text>
          {hovered && (
            <text
              x={cx}
              y={cy + 34}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {((hovered.value / total) * 100).toFixed(1)}%
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="w-full grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
        {data.map((d, i) => {
          const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0.0";
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={i}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                isHovered ? "bg-[#1e1e24]" : "hover:bg-[#16161a]"
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="flex-shrink-0 w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span
                  className="text-sm truncate"
                  style={{ color: isHovered ? d.color : "#d1d5db" }}
                >
                  {d.label}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-[#6b7280]">{pct}%</span>
                <span className="text-sm font-semibold text-[#f9fafb]">
                  {currencySymbol}
                  {d.value.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}