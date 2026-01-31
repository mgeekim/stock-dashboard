import { NextRequest, NextResponse } from 'next/server';
import { getProvider, ProviderError } from '@/features/stock/providers';
import {
  TickInterval,
  StockQuote,
  HistoricalDataPoint,
} from '@/features/stock/types';

interface CompareAPIResponse {
  success: boolean;
  symbols: string[];
  interval: TickInterval;
  quotes: Record<string, StockQuote>;
  historical: Record<string, HistoricalDataPoint[]>;
  errors?: Record<string, string>;
  timestamp: number;
}

const MAX_SYMBOLS = 10;

/**
 * GET /api/stock/compare
 * 여러 종목의 데이터를 비교용으로 조회 (최대 10개)
 *
 * Query Parameters:
 * - symbols: 콤마로 구분된 종목 코드 (예: AAPL,MSFT,GOOGL)
 * - interval: 틱 간격 (1m, 3m, 5m, 10m, 30m, 1h, 1d, 1wk, 1mo) - 기본값: 1d
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<CompareAPIResponse>> {
  const searchParams = request.nextUrl.searchParams;

  // 파라미터 파싱
  const symbolsParam = searchParams.get('symbols') || '';
  const interval = (searchParams.get('interval') || '1d') as TickInterval;

  // 종목 코드 파싱 및 정리
  const symbols = symbolsParam
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s.length > 0);

  // 유효성 검사
  if (symbols.length === 0) {
    return NextResponse.json(
      {
        success: false,
        symbols: [],
        interval,
        quotes: {},
        historical: {},
        errors: { _request: '종목 코드를 입력해주세요' },
        timestamp: Date.now(),
      },
      { status: 400 }
    );
  }

  if (symbols.length > MAX_SYMBOLS) {
    return NextResponse.json(
      {
        success: false,
        symbols,
        interval,
        quotes: {},
        historical: {},
        errors: {
          _request: `최대 ${MAX_SYMBOLS}개 종목까지만 비교할 수 있습니다`,
        },
        timestamp: Date.now(),
      },
      { status: 400 }
    );
  }

  // 중복 제거
  const uniqueSymbols = Array.from(new Set(symbols));

  // 결과 저장 객체
  const quotes: Record<string, StockQuote> = {};
  const historical: Record<string, HistoricalDataPoint[]> = {};
  const errors: Record<string, string> = {};

  // 모든 종목 데이터 병렬 조회
  const fetchPromises = uniqueSymbols.map(async (symbol) => {
    try {
      const provider = await getProvider(symbol);

      const [quote, history] = await Promise.all([
        provider.getQuote(symbol),
        provider.getHistorical(symbol, interval),
      ]);

      quotes[symbol] = quote;
      historical[symbol] = history;
    } catch (error) {
      const errorMessage =
        error instanceof ProviderError
          ? error.message
          : error instanceof Error
            ? error.message
            : '데이터 조회 실패';

      errors[symbol] = errorMessage;
    }
  });

  // 모든 요청 완료 대기
  await Promise.allSettled(fetchPromises);

  // 성공한 종목이 하나도 없으면 에러
  const successCount = Object.keys(quotes).length;
  const hasPartialSuccess = successCount > 0;

  const response: CompareAPIResponse = {
    success: hasPartialSuccess,
    symbols: uniqueSymbols,
    interval,
    quotes,
    historical,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    timestamp: Date.now(),
  };

  // 부분 성공 시에도 200 반환 (errors 필드에 실패 정보 포함)
  // 전체 실패 시 500 반환
  const statusCode = hasPartialSuccess ? 200 : 500;

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
