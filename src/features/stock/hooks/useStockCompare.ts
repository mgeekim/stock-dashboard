import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  StockQuote,
  HistoricalDataPoint,
  PeriodOption,
  CompareDataPoint,
  StockCompareData,
} from '../types';

// API 응답 타입
interface CompareAPIResponse {
  success: boolean;
  symbols: string[];
  period: PeriodOption;
  quotes: Record<string, StockQuote>;
  historical: Record<string, HistoricalDataPoint[]>;
  errors?: Record<string, string>;
  timestamp: number;
}

// 최대 비교 종목 수
const MAX_SYMBOLS = 10;

// 훅 옵션
export interface UseStockCompareOptions {
  symbols?: string[];
  period?: PeriodOption;
  compareMode?: 'percent' | 'price';
  autoFetch?: boolean;
}

// 훅 반환 타입
export interface UseStockCompareReturn {
  data: StockCompareData | null;
  loading: boolean;
  error: string | null;
  partialErrors: Record<string, string>;
  addSymbol: (symbol: string) => boolean;
  removeSymbol: (symbol: string) => void;
  setSymbols: (symbols: string[]) => void;
  setPeriod: (period: PeriodOption) => void;
  setCompareMode: (mode: 'percent' | 'price') => void;
  refetch: () => Promise<void>;
  canAddMore: boolean;
}

/**
 * 여러 종목을 비교하는 커스텀 훅 (최대 10개)
 *
 * @example
 * const { data, addSymbol, removeSymbol } = useStockCompare({
 *   symbols: ['AAPL', 'MSFT'],
 *   compareMode: 'percent'
 * });
 */
export function useStockCompare(options: UseStockCompareOptions = {}): UseStockCompareReturn {
  const {
    symbols: initialSymbols = [],
    period: initialPeriod = '1y',
    compareMode: initialCompareMode = 'percent',
    autoFetch = true,
  } = options;

  // 상태 관리
  const [symbols, setSymbolsState] = useState<string[]>(
    initialSymbols.slice(0, MAX_SYMBOLS).map((s) => s.toUpperCase())
  );
  const [period, setPeriod] = useState<PeriodOption>(initialPeriod);
  const [compareMode, setCompareMode] = useState<'percent' | 'price'>(initialCompareMode);
  const [rawData, setRawData] = useState<{
    quotes: Record<string, StockQuote>;
    historical: Record<string, HistoricalDataPoint[]>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partialErrors, setPartialErrors] = useState<Record<string, string>>({});

  // AbortController 참조
  const abortControllerRef = useRef<AbortController | null>(null);

  // 데이터 fetch 함수
  const fetchData = useCallback(async () => {
    if (symbols.length === 0) {
      setRawData(null);
      setError(null);
      setPartialErrors({});
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
      const params = new URLSearchParams({
        symbols: symbols.join(','),
        period,
      });

      const url = `/api/stock/compare?${params.toString()}`;

      const response = await fetch(url, {
        signal: abortController.signal,
      });

      const result: CompareAPIResponse = await response.json();

      // 요청이 취소된 경우 무시
      if (abortController.signal.aborted) {
        return;
      }

      if (!result.success) {
        const errorMessage =
          result.errors?._request || '데이터 조회에 실패했습니다';
        throw new Error(errorMessage);
      }

      setRawData({
        quotes: result.quotes,
        historical: result.historical,
      });
      setPartialErrors(result.errors || {});
      setError(null);
    } catch (err) {
      // AbortError는 무시
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(errorMessage);
      setRawData(null);
    } finally {
      // 취소되지 않은 경우에만 loading 상태 업데이트
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [symbols, period]);

  // 종목 추가 (중복 체크, 최대 개수 제한)
  const addSymbol = useCallback(
    (symbol: string): boolean => {
      const upperSymbol = symbol.toUpperCase();

      // 이미 존재하는 종목인지 확인
      if (symbols.includes(upperSymbol)) {
        return false;
      }

      // 최대 개수 확인
      if (symbols.length >= MAX_SYMBOLS) {
        return false;
      }

      setSymbolsState((prev) => [...prev, upperSymbol]);
      return true;
    },
    [symbols]
  );

  // 종목 제거
  const removeSymbol = useCallback((symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    setSymbolsState((prev) => prev.filter((s) => s !== upperSymbol));
  }, []);

  // 종목 목록 전체 설정
  const setSymbols = useCallback((newSymbols: string[]) => {
    const upperSymbols = newSymbols.map((s) => s.toUpperCase());
    const uniqueSymbols = Array.from(new Set(upperSymbols));
    setSymbolsState(uniqueSymbols.slice(0, MAX_SYMBOLS));
  }, []);

  // refetch 함수
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // 더 추가할 수 있는지 여부
  const canAddMore = symbols.length < MAX_SYMBOLS;

  // 퍼센트 변환 데이터 계산 (useMemo)
  const data = useMemo((): StockCompareData | null => {
    if (!rawData || symbols.length === 0) {
      return null;
    }

    const { quotes, historical } = rawData;

    // 성공한 종목들만 필터링
    const validSymbols = symbols.filter((s) => historical[s] && historical[s].length > 0);

    if (validSymbols.length === 0) {
      return null;
    }

    // 날짜별로 데이터 정리
    const dateMap = new Map<number, Record<string, number>>();

    // 각 종목의 시작가 저장 (퍼센트 계산용)
    const startPrices: Record<string, number> = {};

    validSymbols.forEach((symbol) => {
      const history = historical[symbol];
      if (history && history.length > 0) {
        // 시작가 저장 (첫 번째 데이터의 종가)
        startPrices[symbol] = history[0].close;

        history.forEach((point) => {
          const existing = dateMap.get(point.timestamp) || {};

          // 모드에 따라 값 계산
          let value: number;
          if (compareMode === 'percent') {
            // 시작가 대비 변동률 계산
            const startPrice = startPrices[symbol];
            value = startPrice > 0 ? ((point.close - startPrice) / startPrice) * 100 : 0;
          } else {
            // 가격 그대로 사용
            value = point.close;
          }

          existing[symbol] = value;
          dateMap.set(point.timestamp, existing);
        });
      }
    });

    // timestamp 기준으로 정렬
    const sortedTimestamps = Array.from(dateMap.keys()).sort((a, b) => a - b);

    // CompareDataPoint 배열 생성
    const compareData: CompareDataPoint[] = sortedTimestamps.map((timestamp) => {
      const values = dateMap.get(timestamp) || {};
      const date = new Date(timestamp * 1000).toISOString().split('T')[0];

      return {
        date,
        timestamp,
        values,
      };
    });

    return {
      symbols: validSymbols,
      period,
      compareMode,
      data: compareData,
      quotes,
    };
  }, [rawData, symbols, period, compareMode]);

  // symbols/period 변경 시 자동 fetch
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
    partialErrors,
    addSymbol,
    removeSymbol,
    setSymbols,
    setPeriod,
    setCompareMode,
    refetch,
    canAddMore,
  };
}
