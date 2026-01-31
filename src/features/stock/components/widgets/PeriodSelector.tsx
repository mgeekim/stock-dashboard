"use client";

import React, { useState } from "react";
import { PeriodOption, PERIOD_CONFIG, CustomPeriod } from "../../types";
import { DateRangePicker } from "./DateRangePicker";

export interface PeriodSelectorProps {
  value: PeriodOption;
  onChange: (period: PeriodOption) => void;
  showCustom?: boolean;
  customPeriod?: CustomPeriod;
  onCustomChange?: (customPeriod: CustomPeriod) => void;
  className?: string;
}

/**
 * 기간 선택기 컴포넌트
 * 프리셋 기간 버튼과 사용자 지정 기간 선택을 제공합니다.
 */
export function PeriodSelector({
  value,
  onChange,
  showCustom = true,
  customPeriod,
  onCustomChange,
  className = "",
}: PeriodSelectorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 프리셋 기간 옵션
  const presetOptions = Object.entries(PERIOD_CONFIG) as [
    Exclude<PeriodOption, "custom">,
    typeof PERIOD_CONFIG["1d"]
  ][];

  // 기간 버튼 클릭 핸들러
  const handlePeriodClick = (period: PeriodOption) => {
    if (period === "custom") {
      setShowDatePicker(true);
    } else {
      onChange(period);
    }
  };

  // 커스텀 기간 적용 핸들러
  const handleCustomApply = (newCustomPeriod: CustomPeriod) => {
    onCustomChange?.(newCustomPeriod);
    onChange("custom");
    setShowDatePicker(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 기간 버튼 그룹 */}
      <div className="flex flex-wrap gap-1">
        {presetOptions.map(([period, config]) => (
          <button
            key={period}
            onClick={() => handlePeriodClick(period)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
              ${value === period
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
          >
            {config.labelEn}
          </button>
        ))}

        {/* 직접 설정 버튼 */}
        {showCustom && (
          <button
            onClick={() => handlePeriodClick("custom")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1
              ${value === "custom"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            직접 설정
          </button>
        )}
      </div>

      {/* 날짜 범위 선택 모달 */}
      {showDatePicker && (
        <div className="absolute top-full left-0 mt-2 z-50">
          <DateRangePicker
            startDate={customPeriod?.startDate}
            endDate={customPeriod?.endDate}
            interval={customPeriod?.interval || "day"}
            onApply={handleCustomApply}
            onClose={() => setShowDatePicker(false)}
          />
        </div>
      )}
    </div>
  );
}
