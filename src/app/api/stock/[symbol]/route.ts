import { NextRequest, NextResponse } from 'next/server';
import { getProvider, isKoreanStock, ProviderError } from '@/features/stock/providers';
import { PeriodOption, CustomPeriod } from '@/features/stock/types';

interface StockAPIResponse {
  success: boolean;
  symbol: string;
  market: 'US' | 'KR';
  quote?: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    previousClose: number;
    open: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    marketCap: number;
    exchange?: string;
    currency?: string;
  };
  historical?: Array<{
    date: string;
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  error?: string;
  timestamp: number;
}

/**
 * GET /api/stock/[symbol]
 * 단일 종목의 시세 및 과거 데이터 조회
 *
 * Query Parameters:
 * - period: 기간 옵션 (1d, 5d, 1m, 3m, 6m, 1y, 5y, max, custom)
 * - startDate: 시작일 (custom 기간일 때, YYYY-MM-DD)
 * - endDate: 종료일 (custom 기간일 때, YYYY-MM-DD)
 * - interval: 봉 간격 (custom 기간일 때, minute|hour|day|week|month)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
): Promise<NextResponse<StockAPIResponse>> {
  const { symbol } = await params;
  const searchParams = request.nextUrl.searchParams;

  // 파라미터 파싱
  const period = (searchParams.get('period') || '1y') as PeriodOption;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const interval = searchParams.get('interval') as CustomPeriod['interval'] | null;

  // 마켓 판별
  const market = isKoreanStock(symbol) ? 'KR' : 'US';

  try {
    // Provider 가져오기
    const provider = await getProvider(symbol);

    // 커스텀 기간 설정
    let customPeriod: CustomPeriod | undefined;
    if (period === 'custom' && startDate && endDate && interval) {
      customPeriod = {
        startDate,
        endDate,
        interval,
      };
    }

    // 병렬로 시세와 과거 데이터 조회
    const [quote, historical] = await Promise.all([
      provider.getQuote(symbol),
      provider.getHistorical(symbol, period, customPeriod),
    ]);

    const response: StockAPIResponse = {
      success: true,
      symbol: symbol.toUpperCase(),
      market,
      quote,
      historical,
      timestamp: Date.now(),
    };

    // 캐시 헤더 설정 (5분)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof ProviderError
        ? error.message
        : error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다';

    const response: StockAPIResponse = {
      success: false,
      symbol: symbol.toUpperCase(),
      market,
      error: errorMessage,
      timestamp: Date.now(),
    };

    const statusCode =
      error instanceof ProviderError && error.code === 'NOT_FOUND'
        ? 404
        : error instanceof ProviderError && error.code === 'NOT_IMPLEMENTED'
          ? 501
          : 500;

    return NextResponse.json(response, { status: statusCode });
  }
}
