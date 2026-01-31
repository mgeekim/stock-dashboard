"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { useStockData, UseStockDataOptions } from "../../hooks";
import { ChartType, TickInterval } from "../../types";
import { CandlestickChart } from "../charts/CandlestickChart";
import { StockLineChart } from "../charts/StockLineChart";
import { StockInfoCard } from "../widgets/StockInfoCard";
import { IntervalSelector } from "../widgets/IntervalSelector";
import { StockSearchInput } from "../widgets/StockSearchInput";

export interface StockChartContainerProps {
  initialSymbol?: string;
  initialInterval?: TickInterval;
  chartType?: ChartType;
  showSearch?: boolean;
  showIntervalSelector?: boolean;
  showInfoCard?: boolean;
  showVolume?: boolean;
  showChartTypeToggle?: boolean;
  onSymbolChange?: (symbol: string) => void;
  className?: string;
}

/**
 * 주식 차트 전체 기능 컨테이너 컴포넌트
 * 검색, 간격 선택, 시세 정보, 차트를 통합합니다.
 */
export function StockChartContainer({
  initialSymbol = "AAPL",
  initialInterval = "1d",
  chartType: initialChartType = "candlestick",
  showSearch = true,
  showIntervalSelector = true,
  showInfoCard = true,
  showVolume = true,
  showChartTypeToggle = true,
  onSymbolChange,
  className = "",
}: StockChartContainerProps) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);

  const options: UseStockDataOptions = {
    symbol: initialSymbol,
    interval: initialInterval,
  };

  const {
    data,
    loading,
    error,
    interval,
    setSymbol,
    setInterval,
  } = useStockData(options);

  // 종목 검색 핸들러
  const handleSearch = (symbol: string) => {
    setSymbol(symbol);
    onSymbolChange?.(symbol);
  };

  // 간격 변경 핸들러
  const handleIntervalChange = (newInterval: TickInterval) => {
    setInterval(newInterval);
  };

  // 차트 타입 토글 버튼
  const ChartTypeToggle = () => (
    <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
      <button
        onClick={() => setChartType("candlestick")}
        className={`px-3 py-1.5 text-sm font-medium transition-colors
          ${chartType === "candlestick"
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        title="캔들스틱 차트"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
      <button
        onClick={() => setChartType("line")}
        className={`px-3 py-1.5 text-sm font-medium transition-colors
          ${chartType === "line"
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        title="라인 차트"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      </button>
      <button
        onClick={() => setChartType("area")}
        className={`px-3 py-1.5 text-sm font-medium transition-colors
          ${chartType === "area"
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        title="영역 차트"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </button>
    </div>
  );

  return (
    <ComponentCard
      title={data?.quote?.name || data?.symbol || "주식 차트"}
      desc={data?.quote?.exchange || ""}
      className={className}
    >
      <div className="space-y-4">
        {/* 헤더 영역: 검색 + 간격 선택 + 차트 타입 */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 검색 */}
          {showSearch && (
            <div className="flex-1 lg:max-w-xs">
              <StockSearchInput
                onSubmit={handleSearch}
                onSelect={handleSearch}
                loading={loading}
              />
            </div>
          )}

          {/* 간격 선택 + 차트 타입 */}
          <div className="flex flex-wrap items-center gap-3">
            {showIntervalSelector && (
              <IntervalSelector
                value={interval}
                onChange={handleIntervalChange}
              />
            )}
            {showChartTypeToggle && <ChartTypeToggle />}
          </div>
        </div>

        {/* 시세 정보 카드 */}
        {showInfoCard && (
          <StockInfoCard
            quote={data?.quote || null}
            symbol={data?.symbol}
            loading={loading}
          />
        )}

        {/* 차트 영역 */}
        <div>
          {chartType === "candlestick" ? (
            <CandlestickChart
              data={data?.historical || []}
              symbol={data?.symbol}
              showVolume={showVolume}
              loading={loading}
              error={error}
              height={400}
            />
          ) : (
            <StockLineChart
              data={data?.historical || []}
              symbol={data?.symbol}
              filled={chartType === "area"}
              loading={loading}
              error={error}
              height={400}
            />
          )}
        </div>
      </div>
    </ComponentCard>
  );
}
