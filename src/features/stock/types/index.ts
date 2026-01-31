// Stock Quote - 현재 시세 정보
export interface StockQuote {
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
}

// Historical Data Point - 과거 데이터 포인트
export interface HistoricalDataPoint {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Period Options - 기간 옵션
export type PeriodOption =
  | '1d'    // 1일 (1분봉)
  | '5d'    // 5일 (5분봉)
  | '1m'    // 1개월 (일봉)
  | '3m'    // 3개월 (일봉)
  | '6m'    // 6개월 (일봉)
  | '1y'    // 1년 (일봉)
  | '5y'    // 5년 (주봉)
  | 'max'   // 전체 (월봉)
  | 'custom'; // 사용자 지정

// Custom Period - 사용자 지정 기간
export interface CustomPeriod {
  startDate: string;  // ISO format (YYYY-MM-DD)
  endDate: string;    // ISO format (YYYY-MM-DD)
  interval: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

// Period Configuration - 기간별 설정
export interface PeriodConfig {
  label: string;
  labelEn: string;
  interval: string;
  days?: number;
}

export const PERIOD_CONFIG: Record<Exclude<PeriodOption, 'custom'>, PeriodConfig> = {
  '1d': { label: '1일', labelEn: '1D', interval: '1m', days: 1 },
  '5d': { label: '5일', labelEn: '5D', interval: '5m', days: 5 },
  '1m': { label: '1개월', labelEn: '1M', interval: '1d', days: 30 },
  '3m': { label: '3개월', labelEn: '3M', interval: '1d', days: 90 },
  '6m': { label: '6개월', labelEn: '6M', interval: '1d', days: 180 },
  '1y': { label: '1년', labelEn: '1Y', interval: '1d', days: 365 },
  '5y': { label: '5년', labelEn: '5Y', interval: '1wk', days: 1825 },
  'max': { label: '전체', labelEn: 'MAX', interval: '1mo', days: 7300 },
};

// Stock Data - API 응답 데이터
export interface StockData {
  symbol: string;
  market: 'US' | 'KR';
  quote: StockQuote;
  historical: HistoricalDataPoint[];
}

// Fetch State - 데이터 조회 상태
export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Compare Data Point - 비교 데이터 포인트
export interface CompareDataPoint {
  date: string;
  timestamp: number;
  values: Record<string, number>;  // { AAPL: 150.5, MSFT: 380.2, ... }
}

// Stock Compare Data - 종목 비교 데이터
export interface StockCompareData {
  symbols: string[];
  period: PeriodOption;
  compareMode: 'percent' | 'price';
  data: CompareDataPoint[];
  quotes: Record<string, StockQuote>;
}

// Search Result - 검색 결과
export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: 'stock' | 'etf' | 'index' | 'fund';
}

// Chart Type - 차트 타입
export type ChartType = 'candlestick' | 'line' | 'area';

// Chart Colors - 차트 색상
export interface ChartColors {
  up: string;
  down: string;
  line: string;
  volume: string;
}

export const DEFAULT_CHART_COLORS: ChartColors = {
  up: '#10B981',    // Green
  down: '#EF4444',  // Red
  line: '#465FFF',  // Brand Blue
  volume: '#9CA3AF', // Gray
};

// Compare Colors - 비교 차트 색상 팔레트 (최대 10개)
export const COMPARE_COLORS: string[] = [
  '#465FFF', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
];
