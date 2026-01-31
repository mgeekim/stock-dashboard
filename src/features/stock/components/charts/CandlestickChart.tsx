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
import { getCandlestickOptions, getVolumeChartOptions } from "../../utils/chartConfig";

export interface CandlestickChartProps {
  data: HistoricalDataPoint[];
  symbol?: string;
  showVolume?: boolean;
  height?: number;
  volumeHeight?: number;
  colors?: ChartColors;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * OHLC 캔들스틱 차트 컴포넌트
 * 주가 데이터를 캔들스틱 형식으로 표시하고, 선택적으로 거래량 차트를 함께 표시합니다.
 */
export function CandlestickChart({
  data,
  symbol,
  showVolume = true,
  height = 350,
  volumeHeight = 100,
  colors = DEFAULT_CHART_COLORS,
  loading = false,
  error = null,
  className = "",
}: CandlestickChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 캔들스틱 데이터 변환
  const candlestickSeries = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [
      {
        name: symbol || "Price",
        data: data.map((point) => ({
          x: new Date(point.timestamp * 1000),
          y: [point.open, point.high, point.low, point.close],
        })),
      },
    ];
  }, [data, symbol]);

  // 거래량 데이터 변환
  const volumeSeries = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [
      {
        name: "Volume",
        data: data.map((point) => ({
          x: new Date(point.timestamp * 1000),
          y: point.volume,
        })),
      },
    ];
  }, [data]);

  // 캔들스틱 옵션
  const candlestickOptions = useMemo((): ApexOptions => {
    const baseOptions = getCandlestickOptions(isDarkMode, colors);

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        id: "candlestick-chart",
        group: showVolume ? "stock-charts" : undefined,
      },
    };
  }, [isDarkMode, colors, showVolume]);

  // 거래량 옵션
  const volumeOptions = useMemo((): ApexOptions => {
    const baseOptions = getVolumeChartOptions(isDarkMode, colors);

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        id: "volume-chart",
        group: "stock-charts",
      },
    };
  }, [isDarkMode, colors]);

  // 데이터가 없는 경우
  if (!loading && !error && (!data || data.length === 0)) {
    return (
      <div className={`flex items-center justify-center h-[${height}px] bg-gray-50 dark:bg-gray-800 rounded ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 캔들스틱 차트 */}
      <BaseStockChart
        series={candlestickSeries}
        options={candlestickOptions}
        type="candlestick"
        height={height}
        loading={loading}
        error={error}
      />

      {/* 거래량 차트 */}
      {showVolume && !loading && !error && (
        <div className="mt-2">
          <BaseStockChart
            series={volumeSeries}
            options={volumeOptions}
            type="bar"
            height={volumeHeight}
          />
        </div>
      )}
    </div>
  );
}
