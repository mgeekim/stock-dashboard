import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StockData,
  StockQuote,
  HistoricalDataPoint,
  PeriodOption,
  CustomPeriod,
} from '../types';

// API 응답 타입
interface StockAPIResponse {
  success: boolean;
  symbol: string;
  market: 'US' | 'KR';
  quote?: StockQuote;
  historical?: HistoricalDataPoint[];
  error?: string;
  timestamp: number;
}

// 훅 옵션
export interface UseStockDataOptions {
  symbol?: string;
  period?: PeriodOption;
  customPeriod?: CustomPeriod;
  autoFetch?: boolean;
}

// 훅 반환 타입
export interface UseStockDataReturn {
  data: StockData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setPeriod: (period: PeriodOption) => void;
  setSymbol: (symbol: string) => void;
  setCustomPeriod: (customPeriod: CustomPeriod | undefined) => void;
}

/**
 * 단일 종목 데이터를 가져오는 커스텀 훅
 *
 * @example
 * const { data, loading, error, refetch } = useStockData({ symbol: 'AAPL', period: '1y' });
 */
export function useStockData(options: UseStockDataOptions = {}): UseStockDataReturn {
  const {
    symbol: initialSymbol = '',
    period: initialPeriod = '1y',
    customPeriod: initialCustomPeriod,
    autoFetch = true,
  } = options;

  // 상태 관리
  const [symbol, setSymbol] = useState(initialSymbol);
  const [period, setPeriod] = useState<PeriodOption>(initialPeriod);
  const [customPeriod, setCustomPeriod] = useState<CustomPeriod | undefined>(initialCustomPeriod);
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AbortController 참조
  const abortControllerRef = useRef<AbortController | null>(null);

  // 데이터 fetch 함수
  const fetchData = useCallback(async () => {
    if (!symbol) {
      setData(null);
      setError(null);
      return;
    }

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새 AbortController 생성
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      // URL 구성
      const params = new URLSearchParams({ period });

      if (period === 'custom' && customPeriod) {
        params.set('startDate', customPeriod.startDate);
        params.set('endDate', customPeriod.endDate);
        params.set('interval', customPeriod.interval);
      }

      const url = `/api/stock/${encodeURIComponent(symbol)}?${params.toString()}`;

      const response = await fetch(url, {
        signal: abortController.signal,
      });

      const result: StockAPIResponse = await response.json();

      // 요청이 취소된 경우 무시
      if (abortController.signal.aborted) {
        return;
      }

      if (!result.success) {
        throw new Error(result.error || '데이터 조회에 실패했습니다');
      }

      // StockData 형태로 변환
      const stockData: StockData = {
        symbol: result.symbol,
        market: result.market,
        quote: result.quote!,
        historical: result.historical || [],
      };

      setData(stockData);
      setError(null);
    } catch (err) {
      // AbortError는 무시
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(errorMessage);
      setData(null);
    } finally {
      // 취소되지 않은 경우에만 loading 상태 업데이트
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [symbol, period, customPeriod]);

  // refetch 함수 (메모이제이션)
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // symbol/period 변경 시 자동 fetch
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    // cleanup: 컴포넌트 언마운트 시 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setPeriod,
    setSymbol,
    setCustomPeriod,
  };
}
