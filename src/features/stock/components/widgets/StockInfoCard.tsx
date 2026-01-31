"use client";

import React from "react";
import { StockQuote } from "../../types";
import {
  formatPrice,
  formatChange,
  formatPercent,
  formatVolume,
  formatMarketCap,
  getChangeBgClass,
  getChangeColorClass,
} from "../../utils/formatters";

export interface StockInfoCardProps {
  quote: StockQuote | null;
  symbol?: string;
  compact?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * 주식 시세 정보 카드 컴포넌트
 * 종목의 현재가, 변동폭, 상세 정보를 표시합니다.
 */
export function StockInfoCard({
  quote,
  symbol,
  compact = false,
  loading = false,
  className = "",
}: StockInfoCardProps) {
  // 로딩 상태
  if (loading) {
    return (
      <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!quote) {
    return (
      <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">
          {symbol ? `${symbol} 데이터를 불러올 수 없습니다` : "종목을 선택해주세요"}
        </p>
      </div>
    );
  }

  const isPositive = quote.changePercent >= 0;

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      {/* 종목명 및 심볼 */}
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {quote.symbol}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {quote.name}
          </p>
        </div>
        {quote.exchange && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {quote.exchange}
          </span>
        )}
      </div>

      {/* 현재가 및 변동 */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatPrice(quote.price, quote.currency)}
        </span>
        <span className={`px-2 py-0.5 rounded text-sm font-medium ${getChangeBgClass(quote.changePercent)}`}>
          {formatChange(quote.change)} ({formatPercent(quote.changePercent)})
        </span>
      </div>

      {/* 상세 정보 (compact=false일 때) */}
      {!compact && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
          <InfoRow label="시가" value={formatPrice(quote.open, quote.currency)} />
          <InfoRow label="전일 종가" value={formatPrice(quote.previousClose, quote.currency)} />
          <InfoRow
            label="고가"
            value={formatPrice(quote.dayHigh, quote.currency)}
            valueClass="text-green-600"
          />
          <InfoRow
            label="저가"
            value={formatPrice(quote.dayLow, quote.currency)}
            valueClass="text-red-600"
          />
          <InfoRow label="거래량" value={formatVolume(quote.volume)} />
          <InfoRow label="시가총액" value={formatMarketCap(quote.marketCap)} />
          <InfoRow
            label="52주 최고"
            value={formatPrice(quote.fiftyTwoWeekHigh, quote.currency)}
            valueClass="text-green-600"
          />
          <InfoRow
            label="52주 최저"
            value={formatPrice(quote.fiftyTwoWeekLow, quote.currency)}
            valueClass="text-red-600"
          />
        </div>
      )}
    </div>
  );
}

// 정보 행 컴포넌트
function InfoRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`font-medium text-gray-900 dark:text-white ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
