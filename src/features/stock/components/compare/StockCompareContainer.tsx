"use client";

import React from "react";
import { useStockCompare, UseStockCompareOptions } from "../../hooks";
import { TickInterval, INTERVAL_CONFIG } from "../../types";
import { StockCompareChart } from "./StockCompareChart";
import { SymbolPicker } from "./SymbolPicker";
import { CompareLegend } from "./CompareLegend";

export interface StockCompareContainerProps {
  initialSymbols?: string[];
  initialInterval?: TickInterval;
  initialCompareMode?: "percent" | "price";
  className?: string;
}

/**
 * 종목 비교 컨테이너 컴포넌트
 * 종목 선택, 간격 선택, 비교 차트, 범례를 통합합니다.
 */
export function StockCompareContainer({
  initialSymbols = [],
  initialInterval = "1d",
  initialCompareMode = "percent",
  className = "",
}: StockCompareContainerProps) {
  const options: UseStockCompareOptions = {
    symbols: initialSymbols,
    interval: initialInterval,
    compareMode: initialCompareMode,
  };

  const {
    data,
    loading,
    error,
    partialErrors,
    addSymbol,
    removeSymbol,
    setInterval,
    setCompareMode,
  } = useStockCompare(options);

  // 간격 옵션
  const intervalOptions = Object.entries(INTERVAL_CONFIG) as [
    TickInterval,
    typeof INTERVAL_CONFIG["1d"]
  ][];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 상단 컨트롤 영역 */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 종목 선택 */}
        <div className="flex-1">
          <SymbolPicker
            symbols={data?.symbols || []}
            onAdd={addSymbol}
            onRemove={removeSymbol}
            maxSymbols={10}
          />
        </div>

        {/* 간격 & 모드 선택 */}
        <div className="flex flex-wrap gap-2 lg:flex-nowrap">
          {/* 간격 선택 */}
          <div className="flex flex-wrap gap-1">
            {intervalOptions.map(([key, config]) => (
              <button
                key={key}
                onClick={() => setInterval(key)}
                className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-colors
                  ${data?.interval === key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {config.label}
              </button>
            ))}
          </div>

          {/* 비교 모드 토글 */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => setCompareMode("percent")}
              className={`px-4 py-2 text-sm font-medium transition-colors
                ${data?.compareMode === "percent"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              %
            </button>
            <button
              onClick={() => setCompareMode("price")}
              className={`px-4 py-2 text-sm font-medium transition-colors
                ${data?.compareMode === "price"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              $
            </button>
          </div>
        </div>
      </div>

      {/* 부분 오류 표시 */}
      {Object.keys(partialErrors).length > 0 && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            일부 종목의 데이터를 불러오지 못했습니다:
          </p>
          <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            {Object.entries(partialErrors).map(([symbol, errorMsg]) => (
              <li key={symbol}>
                <span className="font-medium">{symbol}</span>: {errorMsg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 비교 차트 */}
      <StockCompareChart
        data={data}
        loading={loading}
        error={error}
        height={400}
      />

      {/* 범례 */}
      {data && data.symbols.length > 0 && (
        <CompareLegend
          symbols={data.symbols}
          quotes={data.quotes}
        />
      )}
    </div>
  );
}
