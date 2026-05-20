"use client";
import React from 'react';

import { useState } from "react";

interface MonthlyDataPoint {
  month: string;
  total: number;
}

interface LineChartProps {
  data: MonthlyDataPoint[];
  width?: number;
  height?: number;
  className?: string;
}

export default function LineChart({
  data,
  width = 600,
  height = 300,
  className = "",
}: LineChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number;
    month: string;
  } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-gray-500 ${className}`}
        style={{ width, height }}
      >
        No data available
      </div>
    );
  }

  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 50;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxValue = Math.max(...data.map((d) => d.total), 1);
  const minValue = 0;
  const valueRange = maxValue - minValue || 1;

  const getX = (index: number) =>
    paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;

  const getY = (value: number) =>
    paddingTop + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d.total),
    value: d.total,
    month: d.month,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : "";

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => {
    const value = minValue + (valueRange * i) / yTickCount;
    return {
      value,
      y: getY(value),
    };
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={paddingLeft + chartWidth}
              y2={tick.y}
              stroke="#2a2a35"
              strokeWidth="1"
              strokeDasharray={i === 0 ? "none" : "4 4"}
            />
            <text
              x={paddingLeft - 10}
              y={tick.y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#6b7280"
              fontSize="11"
              fontFamily="system-ui, sans-serif"
            >
              {formatCurrency(tick.value)}
            </text>
          </g>
        ))}

        {/* X-axis baseline */}
        <line
          x1={paddingLeft}
          y1={paddingTop + chartHeight}
          x2={paddingLeft + chartWidth}
          y2={paddingTop + chartHeight}
          stroke="#2a2a35"
          strokeWidth="1"
        />

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill="url(#areaGradient)" strokeWidth="0" />
        )}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        )}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={paddingTop + chartHeight + 20}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="11"
            fontFamily="system-ui, sans-serif"
          >
            {p.month}
          </text>
        ))}

        {/* Data points and hover areas */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Invisible hover target */}
            <rect
              x={p.x - (chartWidth / (data.length * 2))}
              y={paddingTop}
              width={chartWidth / data.length}
              height={chartHeight}
              fill="transparent"
              onMouseEnter={() =>
                setTooltip({ x: p.x, y: p.y, value: p.value, month: p.month })
              }
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "crosshair" }}
            />

            {/* Dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r={tooltip?.month === p.month ? 6 : 4}
              fill={tooltip?.month === p.month ? "#f97316" : "#1a1a24"}
              stroke="#f97316"
              strokeWidth="2"
              style={{ transition: "r 0.15s ease" }}
            />
          </g>
        ))}

        {/* Tooltip */}
        {tooltip && (() => {
          const tooltipWidth = 110;
          const tooltipHeight = 48;
          const tooltipPadding = 10;
          let tx = tooltip.x - tooltipWidth / 2;
          let ty = tooltip.y - tooltipHeight - tooltipPadding;

          if (tx < paddingLeft) tx = paddingLeft;
          if (tx + tooltipWidth > width - paddingRight)
            tx = width - paddingRight - tooltipWidth;
          if (ty < 0) ty = tooltip.y + tooltipPadding;

          return (
            <g>
              <rect
                x={tx}
                y={ty}
                width={tooltipWidth}
                height={tooltipHeight}
                rx="6"
                fill="#1a1a24"
                stroke="#2a2a35"
                strokeWidth="1"
              />
              <text
                x={tx + tooltipWidth / 2}
                y={ty + 16}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
                fontFamily="system-ui, sans-serif"
              >
                {tooltip.month}
              </text>
              <text
                x={tx + tooltipWidth / 2}
                y={ty + 34}
                textAnchor="middle"
                fill="#f97316"
                fontSize="13"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                ${tooltip.value.toFixed(2)}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}