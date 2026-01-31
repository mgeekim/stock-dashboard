"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";

// 로컬스토리지 키
const RECENT_SEARCHES_KEY = "stock-recent-searches";
const MAX_RECENT_SEARCHES = 5;

export interface StockSearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (symbol: string) => void;
  onSelect?: (symbol: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
}

/**
 * 종목 검색 입력 컴포넌트
 * 검색 기능과 최근 검색 기록을 제공합니다.
 */
export function StockSearchInput({
  value: controlledValue,
  onChange,
  onSubmit,
  onSelect,
  placeholder = "종목 코드 검색 (예: AAPL, MSFT)",
  loading = false,
  className = "",
}: StockSearchInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // controlled/uncontrolled 처리
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // 최근 검색 기록 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // 로컬스토리지 에러 무시
    }
  }, []);

  // 최근 검색 기록 저장
  const saveToRecentSearches = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase();
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== upper);
      const updated = [upper, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // 로컬스토리지 에러 무시
      }

      return updated;
    });
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 입력값 변경 핸들러
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.toUpperCase();
      setInternalValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  // 검색 실행 핸들러
  const handleSubmit = useCallback(() => {
    const symbol = value.trim();
    if (symbol) {
      saveToRecentSearches(symbol);
      onSubmit?.(symbol);
      setShowRecent(false);
    }
  }, [value, saveToRecentSearches, onSubmit]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Escape") {
        setShowRecent(false);
      }
    },
    [handleSubmit]
  );

  // 최근 검색 항목 선택 핸들러
  const handleSelectRecent = useCallback(
    (symbol: string) => {
      setInternalValue(symbol);
      onChange?.(symbol);
      onSelect?.(symbol);
      setShowRecent(false);
    },
    [onChange, onSelect]
  );

  // 최근 검색 기록 삭제
  const handleClearRecent = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // 로컬스토리지 에러 무시
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 검색 입력 필드 */}
      <div className="relative">
        {/* 검색 아이콘 */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowRecent(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* 로딩/검색 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium
            bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50
            disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            "검색"
          )}
        </button>
      </div>

      {/* 최근 검색 기록 드롭다운 */}
      {showRecent && recentSearches.length > 0 && !value && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              최근 검색
            </span>
            <button
              onClick={handleClearRecent}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              전체 삭제
            </button>
          </div>
          <ul>
            {recentSearches.map((symbol) => (
              <li key={symbol}>
                <button
                  onClick={() => handleSelectRecent(symbol)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {symbol}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
