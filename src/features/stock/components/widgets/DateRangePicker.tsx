"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { CustomPeriod } from "../../types";

export interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  interval?: CustomPeriod["interval"];
  onApply: (customPeriod: CustomPeriod) => void;
  onClose: () => void;
  className?: string;
}

// 봉 간격 옵션
const INTERVAL_OPTIONS: { value: CustomPeriod["interval"]; label: string }[] = [
  { value: "minute", label: "1분봉" },
  { value: "hour", label: "1시간봉" },
  { value: "day", label: "일봉" },
  { value: "week", label: "주봉" },
  { value: "month", label: "월봉" },
];

// 간격별 최대 기간 (일 단위)
const MAX_PERIOD_BY_INTERVAL: Record<CustomPeriod["interval"], number> = {
  minute: 7,     // 1분봉: 최대 7일
  hour: 60,      // 1시간봉: 최대 60일
  day: 365 * 5,  // 일봉: 최대 5년
  week: 365 * 10, // 주봉: 최대 10년
  month: 365 * 20, // 월봉: 최대 20년
};

/**
 * 날짜 범위 선택 컴포넌트
 * flatpickr를 사용하여 시작일/종료일과 봉 간격을 선택합니다.
 */
export function DateRangePicker({
  startDate: initialStartDate,
  endDate: initialEndDate,
  interval: initialInterval = "day",
  onApply,
  onClose,
  className = "",
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(initialStartDate || "");
  const [endDate, setEndDate] = useState(initialEndDate || "");
  const [interval, setInterval] = useState<CustomPeriod["interval"]>(initialInterval);
  const [error, setError] = useState<string | null>(null);

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // flatpickr 초기화
  useEffect(() => {
    if (startInputRef.current) {
      const fp = flatpickr(startInputRef.current, {
        dateFormat: "Y-m-d",
        defaultDate: startDate || undefined,
        onChange: (dates) => {
          if (dates[0]) {
            setStartDate(dates[0].toISOString().split("T")[0]);
            setError(null);
          }
        },
      });
      return () => fp.destroy();
    }
  }, []);

  useEffect(() => {
    if (endInputRef.current) {
      const fp = flatpickr(endInputRef.current, {
        dateFormat: "Y-m-d",
        defaultDate: endDate || undefined,
        onChange: (dates) => {
          if (dates[0]) {
            setEndDate(dates[0].toISOString().split("T")[0]);
            setError(null);
          }
        },
      });
      return () => fp.destroy();
    }
  }, []);

  // 유효성 검사
  const validate = useCallback((): string | null => {
    if (!startDate || !endDate) {
      return "시작일과 종료일을 선택해주세요";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return "종료일은 시작일 이후여야 합니다";
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const maxDays = MAX_PERIOD_BY_INTERVAL[interval];

    if (diffDays > maxDays) {
      return `${INTERVAL_OPTIONS.find((o) => o.value === interval)?.label}은 최대 ${maxDays}일까지 선택 가능합니다`;
    }

    return null;
  }, [startDate, endDate, interval]);

  // 적용 버튼 클릭
  const handleApply = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    onApply({
      startDate,
      endDate,
      interval,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80 ${className}`}
    >
      <h4 className="font-medium text-gray-900 dark:text-white mb-4">
        기간 직접 설정
      </h4>

      {/* 시작일 */}
      <div className="mb-3">
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
          시작일
        </label>
        <input
          ref={startInputRef}
          type="text"
          placeholder="YYYY-MM-DD"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 종료일 */}
      <div className="mb-3">
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
          종료일
        </label>
        <input
          ref={endInputRef}
          type="text"
          placeholder="YYYY-MM-DD"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 봉 간격 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
          봉 간격
        </label>
        <select
          value={interval}
          onChange={(e) => {
            setInterval(e.target.value as CustomPeriod["interval"]);
            setError(null);
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {INTERVAL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
            bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
            transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 text-sm font-medium text-white
            bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          적용
        </button>
      </div>
    </div>
  );
}
