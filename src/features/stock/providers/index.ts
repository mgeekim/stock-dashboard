import {
  StockQuote,
  HistoricalDataPoint,
  PeriodOption,
  CustomPeriod,
  SearchResult,
} from '../types';

/**
 * Stock Data Provider 인터페이스
 * 각 주식 데이터 소스(Yahoo Finance, KIS 등)는 이 인터페이스를 구현해야 함
 */
export interface StockDataProvider {
  /**
   * 현재 시세 조회
   * @param symbol - 종목 코드
   * @returns 시세 정보
   */
  getQuote(symbol: string): Promise<StockQuote>;

  /**
   * 과거 데이터 조회
   * @param symbol - 종목 코드
   * @param period - 기간 옵션
   * @param customPeriod - 사용자 지정 기간 (period가 'custom'일 때)
   * @returns 과거 데이터 배열
   */
  getHistorical(
    symbol: string,
    period: PeriodOption,
    customPeriod?: CustomPeriod
  ): Promise<HistoricalDataPoint[]>;

  /**
   * 종목 검색
   * @param query - 검색어
   * @returns 검색 결과 배열
   */
  search(query: string): Promise<SearchResult[]>;

  /**
   * Provider 이름
   */
  readonly name: string;

  /**
   * 지원 시장
   */
  readonly market: 'US' | 'KR';
}

/**
 * 한국 주식 심볼인지 확인
 * @param symbol - 종목 코드
 * @returns 한국 주식 여부
 */
export function isKoreanStock(symbol: string): boolean {
  // 한국 주식은 6자리 숫자 (예: 005930)
  return /^\d{6}$/.test(symbol);
}

/**
 * 심볼에 맞는 Provider 가져오기
 * @param symbol - 종목 코드
 * @returns Provider 인스턴스
 */
export async function getProvider(symbol: string): Promise<StockDataProvider> {
  if (isKoreanStock(symbol)) {
    const { KISProvider } = await import('./kisProvider');
    return new KISProvider();
  }

  const { YahooProvider } = await import('./yahooProvider');
  return new YahooProvider();
}

/**
 * Provider 에러 클래스
 */
export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}
