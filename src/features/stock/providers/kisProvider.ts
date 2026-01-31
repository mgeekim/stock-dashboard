import {
  StockQuote,
  HistoricalDataPoint,
  PeriodOption,
  CustomPeriod,
  SearchResult,
} from '../types';
import { StockDataProvider, ProviderError } from './index';

/**
 * KIS Open API Provider (한국투자증권)
 * 한국 주식(KOSPI, KOSDAQ) 데이터 제공
 *
 * TODO: 실제 KIS API 연동 구현
 * - 환경변수: KIS_APP_KEY, KIS_APP_SECRET, KIS_ACCOUNT_NO
 * - 문서: https://apiportal.koreainvestment.com/
 */
export class KISProvider implements StockDataProvider {
  readonly name = 'KIS Open API';
  readonly market = 'KR' as const;

  constructor() {
    // 환경변수 체크 (향후 구현 시 사용)
    this.checkEnvironment();
  }

  /**
   * 환경변수 체크
   */
  private checkEnvironment(): void {
    const requiredEnvVars = [
      'KIS_APP_KEY',
      'KIS_APP_SECRET',
      'KIS_ACCOUNT_NO',
    ];

    const missing = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missing.length > 0) {
      console.warn(
        `[KISProvider] 환경변수가 설정되지 않았습니다: ${missing.join(', ')}`
      );
    }
  }

  /**
   * 현재 시세 조회
   * @throws ProviderError - 미구현 상태
   */
  async getQuote(symbol: string): Promise<StockQuote> {
    // TODO: KIS API 연동 구현
    // - POST /uapi/domestic-stock/v1/quotations/inquire-price
    // - 헤더: authorization, appkey, appsecret, tr_id
    throw new ProviderError(
      `한국 주식(${symbol})은 현재 지원 준비 중입니다. 추후 업데이트 예정입니다.`,
      this.name,
      'NOT_IMPLEMENTED'
    );
  }

  /**
   * 과거 데이터 조회
   * @throws ProviderError - 미구현 상태
   */
  async getHistorical(
    symbol: string,
    period: PeriodOption,
    customPeriod?: CustomPeriod
  ): Promise<HistoricalDataPoint[]> {
    // TODO: KIS API 연동 구현
    // - GET /uapi/domestic-stock/v1/quotations/inquire-daily-price
    // - 일별/주별/월별 시세 조회
    throw new ProviderError(
      `한국 주식(${symbol})은 현재 지원 준비 중입니다. 추후 업데이트 예정입니다.`,
      this.name,
      'NOT_IMPLEMENTED'
    );
  }

  /**
   * 종목 검색
   * @throws ProviderError - 미구현 상태
   */
  async search(query: string): Promise<SearchResult[]> {
    // TODO: KIS API 연동 구현
    // - 종목 마스터 데이터 활용
    // - 또는 별도 검색 API 사용
    throw new ProviderError(
      `한국 주식 검색(${query})은 현재 지원 준비 중입니다. 추후 업데이트 예정입니다.`,
      this.name,
      'NOT_IMPLEMENTED'
    );
  }
}

/**
 * KIS API 인증 토큰 관리 (향후 구현)
 *
 * TODO: 구현 필요 사항
 * - 토큰 발급: POST /oauth2/tokenP
 * - 토큰 캐싱 (24시간 유효)
 * - 토큰 갱신 로직
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class KISAuthManager {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  async getAccessToken(): Promise<string> {
    // TODO: 토큰 발급/갱신 구현
    throw new Error('Not implemented');
  }

  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return new Date() < this.tokenExpiry;
  }
}
