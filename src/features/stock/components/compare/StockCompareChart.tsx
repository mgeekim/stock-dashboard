"use client";

import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import { useTheme } from "@/context/ThemeContext";
import { BaseStockChart } from "../charts/BaseStockChart";
import { StockCompareData, COMPARE_COLORS } from "../../types";
import { getCompareChartOptions } from "../../utils/chartConfig";

export interface StockCompareChartProps {
  data: StockCompareData | null;
  height?: number;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * 종목 비교 라인 차트 컴포넌트
 * 여러 종목의 가격/수익률을 라인 차트로 비교합니다.
 */
export function StockCompareChart({
  data,
  height = 400,
  loading = false,
  error = null,
  className = "",
}: StockCompareChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 시리즈 데이터 변환
  const series = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];

    return data.symbols.map((symbol) => ({
      name: symbol,
      data: data.data.map((point) => ({
        x: new Date(point.timestamp * 1000),
        y: point.values[symbol] ?? null,
      })),
    }));
  }, [data]);

  // 시리즈 색상
  const seriesColors = useMemo(() => {
    if (!data) return [];
    return data.symbols.map((_, index) => COMPARE_COLORS[index % COMPARE_COLORS.length]);
  }, [data]);

  // 차트 옵션
  const chartOptions = useMemo((): ApexOptions => {
    const isPercentMode = data?.compareMode === "percent";
    const baseOptions = getCompareChartOptions(isDarkMode, seriesColors, isPercentMode);

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        id: "compare-chart",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        zoom: {
          enabled: true,
        },
      },
    };
  }, [isDarkMode, seriesColors, data?.compareMode]);

  // 데이터가 없는 경우
  if (!loading && !error && (!data || data.symbols.length === 0)) {
    return (
      <div className={`flex items-center justify-center h-[${height}px] bg-gray-50 dark:bg-gray-800 rounded ${className}`}>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            비교할 종목을 추가해주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <BaseStockChart
      series={series}
      options={chartOptions}
      type="line"
      height={height}
      loading={loading}
      error={error}
      className={className}
    />
  );
}
