"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useTheme } from "@/context/ThemeContext";

// SSR 비활성화로 ApexCharts 동적 임포트
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

// 로딩 스켈레톤 컴포넌트
function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[350px] bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

// 에러 메시지 컴포넌트
function ChartError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[350px] bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
}

export interface BaseStockChartProps {
  series: ApexAxisChartSeries;
  options: ApexOptions;
  type:
    | "line"
    | "area"
    | "bar"
    | "candlestick"
    | "boxPlot"
    | "rangeBar"
    | "rangeArea"
    | "bubble"
    | "scatter"
    | "heatmap"
    | "treemap"
    | "pie"
    | "donut"
    | "radialBar"
    | "polarArea"
    | "radar";
  height?: number | string;
  width?: number | string;
  className?: string;
  loading?: boolean;
  error?: string | null;
}

/**
 * SSR-safe 기본 주식 차트 래퍼 컴포넌트
 * ApexCharts를 동적으로 로드하고 다크모드를 자동으로 처리합니다.
 */
export function BaseStockChart({
  series,
  options,
  type,
  height = 350,
  width = "100%",
  className = "",
  loading = false,
  error = null,
}: BaseStockChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 로딩 상태
  if (loading) {
    return <ChartSkeleton />;
  }

  // 에러 상태
  if (error) {
    return <ChartError message={error} />;
  }

  // 다크모드에 따른 텍스트/그리드 색상 조정
  const textColor = isDarkMode ? "#9CA3AF" : "#6B7280";
  const gridColor = isDarkMode ? "#374151" : "#E5E7EB";

  // 옵션에 다크모드 스타일 적용
  const mergedOptions: ApexOptions = {
    ...options,
    chart: {
      ...options.chart,
      background: "transparent",
    },
    grid: {
      ...options.grid,
      borderColor: gridColor,
    },
    xaxis: {
      ...options.xaxis,
      labels: {
        ...options.xaxis?.labels,
        style: {
          ...options.xaxis?.labels?.style,
          colors: textColor,
        },
      },
    },
    yaxis: Array.isArray(options.yaxis)
      ? options.yaxis.map((y) => ({
          ...y,
          labels: {
            ...y.labels,
            style: {
              ...y.labels?.style,
              colors: textColor,
            },
          },
        }))
      : {
          ...options.yaxis,
          labels: {
            ...options.yaxis?.labels,
            style: {
              ...options.yaxis?.labels?.style,
              colors: textColor,
            },
          },
        },
    tooltip: {
      ...options.tooltip,
      theme: isDarkMode ? "dark" : "light",
    },
  };

  return (
    <div className={`overflow-x-auto custom-scrollbar ${className}`}>
      <div className="min-w-[400px]">
        <ReactApexChart
          options={mergedOptions}
          series={series}
          type={type}
          height={height}
          width={width}
        />
      </div>
    </div>
  );
}
