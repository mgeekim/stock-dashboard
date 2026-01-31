"use client";

import React from "react";
import { StockQuote, COMPARE_COLORS } from "../../types";
import { formatPrice, formatPercent } from "../../utils/formatters";

export interface CompareLegendProps {
  symbols: string[];
  quotes: Record<string, StockQuote>;
  colors?: string[];
  className?: string;
}

/**
 * 종목 비교 범례 컴포넌트
 * 각 종목의 색상, 현재가, 변동률을 표시합니다.
 */
export function CompareLegend({
  symbols,
  quotes,
  colors = COMPARE_COLORS,
  className = "",
}: CompareLegendProps) {
  if (symbols.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
      {symbols.map((symbol, index) => {
        const quote = quotes[symbol];
        const color = colors[index % colors.length];

        if (!quote) {
          return (
            <div
              key={symbol}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {symbol}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  데이터 없음
                </p>
              </div>
            </div>
          );
        }

        const isPositive = quote.changePercent >= 0;

        return (
          <div
            key={symbol}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            {/* 색상 인디케이터 */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />

            {/* 종목 정보 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {symbol}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {formatPrice(quote.price, quote.currency)}
                </p>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {quote.name}
                </p>
                <p
                  className={`text-sm font-medium whitespace-nowrap ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {formatPercent(quote.changePercent)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
