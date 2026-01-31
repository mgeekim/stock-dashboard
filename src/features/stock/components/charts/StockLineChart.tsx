"use client";

import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import { useTheme } from "@/context/ThemeContext";
import { BaseStockChart } from "./BaseStockChart";
import {
  HistoricalDataPoint,
  DEFAULT_CHART_COLORS,
  ChartColors,
} from "../../types";
import { getLineChartOptions } from "../../utils/chartConfig";

export interface StockLineChartProps {
  data: HistoricalDataPoint[];
  symbol?: string;
  valueKey?: "close" | "open" | "high" | "low";
  filled?: boolean;
  height?: number;
  color?: string;
  colors?: ChartColors;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * 주식 라인/영역 차트 컴포넌트
 * 주가 데이터를 라인 또는 영역 차트 형식으로 표시합니다.
 */
export function StockLineChart({
  data,
  symbol,
  valueKey = "close",
  filled = false,
  height = 350,
  color,
  colors = DEFAULT_CHART_COLORS,
  loading = false,
  error = null,
  className = "",
}: StockLineChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 라인 데이터 변환
  const lineSeries = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [
      {
        name: symbol || "Price",
        data: data.map((point) => ({
          x: new Date(point.timestamp * 1000),
          y: point[valueKey],
        })),
      },
    ];
  }, [data, symbol, valueKey]);

  // 차트 옵션
  const chartOptions = useMemo((): ApexOptions => {
    const chartColors: ChartColors = color
      ? { ...colors, line: color }
      : colors;

    const baseOptions = getLineChartOptions(isDarkMode, chartColors, filled);

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        id: "line-chart",
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
  }, [isDarkMode, colors, color, filled]);

  // 데이터가 없는 경우
  if (!loading && !error && (!data || data.length === 0)) {
    return (
      <div className={`flex items-center justify-center h-[${height}px] bg-gray-50 dark:bg-gray-800 rounded ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <BaseStockChart
      series={lineSeries}
      options={chartOptions}
      type={filled ? "area" : "line"}
      height={height}
      loading={loading}
      error={error}
      className={className}
    />
  );
}
