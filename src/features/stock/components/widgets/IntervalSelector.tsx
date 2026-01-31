"use client";

import React from "react";
import { TickInterval, INTERVAL_CONFIG } from "../../types";

export interface IntervalSelectorProps {
  value: TickInterval;
  onChange: (interval: TickInterval) => void;
  className?: string;
}

/**
 * 틱 간격 선택기 컴포넌트
 * 1분, 3분, 5분, 10분, 30분, 1시간, 1일, 1주, 1개월 간격을 선택할 수 있습니다.
 */
export function IntervalSelector({
  value,
  onChange,
  className = "",
}: IntervalSelectorProps) {
  // 간격 옵션
  const intervalOptions = Object.entries(INTERVAL_CONFIG) as [
    TickInterval,
    typeof INTERVAL_CONFIG["1d"]
  ][];

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {intervalOptions.map(([interval, config]) => (
        <button
          key={interval}
          onClick={() => onChange(interval)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
            ${value === interval
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
        >
          {config.label}
        </button>
      ))}
    </div>
  );
}
