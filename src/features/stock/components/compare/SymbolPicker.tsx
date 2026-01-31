"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { COMPARE_COLORS } from "../../types";

export interface SymbolPickerProps {
  symbols: string[];
  onAdd: (symbol: string) => boolean;
  onRemove: (symbol: string) => void;
  maxSymbols?: number;
  placeholder?: string;
  className?: string;
}

/**
 * 종목 선택 컴포넌트
 * 종목을 추가/제거할 수 있는 검색 UI를 제공합니다.
 */
export function SymbolPicker({
  symbols,
  onAdd,
  onRemove,
  maxSymbols = 10,
  placeholder = "종목 코드 입력 (예: AAPL)",
  className = "",
}: SymbolPickerProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMaxReached = symbols.length >= maxSymbols;

  // 종목 추가 처리
  const handleAdd = useCallback(() => {
    const symbol = inputValue.trim().toUpperCase();

    if (!symbol) {
      return;
    }

    // 유효성 검사
    if (!/^[A-Z0-9.]{1,10}$/.test(symbol)) {
      setError("유효하지 않은 종목 코드입니다");
      return;
    }

    // 중복 체크
    if (symbols.includes(symbol)) {
      setError("이미 추가된 종목입니다");
      return;
    }

    // 최대 개수 체크
    if (isMaxReached) {
      setError(`최대 ${maxSymbols}개까지 추가할 수 있습니다`);
      return;
    }

    const success = onAdd(symbol);
    if (success) {
      setInputValue("");
      setError(null);
    } else {
      setError("종목을 추가할 수 없습니다");
    }
  }, [inputValue, symbols, isMaxReached, maxSymbols, onAdd]);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd]
  );

  // 입력값 변경 시 에러 초기화
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value.toUpperCase());
      setError(null);
    },
    []
  );

  // 에러 자동 숨김
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className={className}>
      {/* 입력 영역 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isMaxReached}
            placeholder={isMaxReached ? `최대 ${maxSymbols}개 도달` : placeholder}
            className={`w-full px-4 py-2 border rounded-lg text-sm
              ${isMaxReached
                ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                : "bg-white dark:bg-gray-800"
              }
              ${error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              }
              focus:outline-none focus:ring-2 focus:border-transparent
              dark:text-white`}
          />
          {error && (
            <p className="absolute -bottom-5 left-0 text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={isMaxReached || !inputValue.trim()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${isMaxReached || !inputValue.trim()
              ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
              : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
        >
          추가
        </button>
      </div>

      {/* 선택된 종목 칩 */}
      {symbols.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {symbols.map((symbol, index) => (
            <div
              key={symbol}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: COMPARE_COLORS[index % COMPARE_COLORS.length] }}
            >
              <span>{symbol}</span>
              <button
                onClick={() => onRemove(symbol)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                aria-label={`${symbol} 제거`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 카운터 */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {symbols.length} / {maxSymbols} 종목
      </p>
    </div>
  );
}
