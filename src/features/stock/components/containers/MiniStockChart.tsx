"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useTheme } from "@/context/ThemeContext";
import { useStockData } from "../../hooks";
import { TickInterval, DEFAULT_CHART_COLORS } from "../../types";
import {
  formatPrice,
  formatPercent,
  getChangeBgClass,
} from "../../utils/formatters";

// SSR 비활성화로 ApexCharts 동적 임포트
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <MiniChartSkeleton />,
});

// 미니 차트 스켈레톤
function MiniChartSkeleton() {
  return <div className="h-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />;
}

export interface MiniStockChartProps {
  symbol: string;
  interval?: TickInterval;
  height?: number;
  showPrice?: boolean;
  showChange?: boolean;
  chartType?: "line" | "area";
  href?: string;
  className?: string;
}

/**
 * 대시보드용 미니 주식 차트 컴포넌트
 * 컴팩트한 형태로 종목의 가격과 추세를 표시합니다.
 */
export function MiniStockChart({
  symbol,
  interval = "1d",
  height = 120,
  showPrice = true,
  showChange = true,
  chartType = "area",
  href,
  className = "",
}: MiniStockChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { data, loading, error } = useStockData({
    symbol,
    interval,
  });

  // 차트 시리즈 데이터
  const series = useMemo(() => {
    if (!data?.historical || data.historical.length === 0) return [];

    return [
      {
        name: symbol,
        data: data.historical.map((point) => ({
          x: new Date(point.timestamp * 1000),
          y: point.close,
        })),
      },
    ];
  }, [data?.historical, symbol]);

  // 차트 색상 (상승/하락에 따라)
  const chartColor = useMemo(() => {
    if (!data?.quote) return DEFAULT_CHART_COLORS.line;
    return data.quote.changePercent >= 0
      ? DEFAULT_CHART_COLORS.up
      : DEFAULT_CHART_COLORS.down;
  }, [data?.quote]);

  // 미니 차트 옵션
  const chartOptions = useMemo((): ApexOptions => {
    return {
      chart: {
        type: chartType === "area" ? "area" : "line",
        sparkline: {
          enabled: true,
        },
        animations: {
          enabled: true,
          speed: 300,
        },
      },
      colors: [chartColor],
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: chartType === "area"
        ? {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.4,
              opacityTo: 0.05,
              stops: [0, 100],
            },
          }
        : { type: "solid" },
      tooltip: {
        enabled: false,
      },
    };
  }, [chartType, chartColor]);

  // 로딩 상태
  if (loading) {
    return (
      <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">{symbol}</p>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  const content = (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow transition-shadow ${href ? "hover:shadow-md cursor-pointer" : ""} ${className}`}>
      {/* 헤더: 종목명 + 가격 */}
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {symbol}
          </p>
          {data?.quote?.name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {data.quote.name}
            </p>
          )}
        </div>

        {/* 변동률 배지 */}
        {showChange && data?.quote && (
          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getChangeBgClass(data.quote.changePercent)}`}>
            {formatPercent(data.quote.changePercent)}
          </span>
        )}
      </div>

      {/* 가격 */}
      {showPrice && data?.quote && (
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {formatPrice(data.quote.price, data.quote.currency)}
        </p>
      )}

      {/* 미니 차트 */}
      <div style={{ height: `${height}px` }}>
        {series.length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type={chartType === "area" ? "area" : "line"}
            height={height}
            width="100%"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-xs">
            데이터 없음
          </div>
        )}
      </div>
    </div>
  );

  // 링크가 있으면 Link로 감싸기
  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
