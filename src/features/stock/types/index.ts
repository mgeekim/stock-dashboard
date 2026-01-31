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

// Tick Interval - 틱 간격 옵션
export type TickInterval =
  | '1m'    // 1분
  | '3m'    // 3분
  | '5m'    // 5분
  | '10m'   // 10분
  | '30m'   // 30분
  | '1h'    // 1시간
  | '1d'    // 1일
  | '1wk'   // 1주
  | '1mo';  // 1개월

// Interval Configuration - 간격별 설정
export interface IntervalConfig {
  label: string;
  labelEn: string;
  yahooInterval: string;  // Yahoo Finance API interval
  defaultDays: number;    // 기본 조회 기간 (일)
  maxDays: number;        // 최대 조회 기간 (일)
}

export const INTERVAL_CONFIG: Record<TickInterval, IntervalConfig> = {
  '1m':  { label: '1분', labelEn: '1m', yahooInterval: '1m', defaultDays: 1, maxDays: 7 },
  '3m':  { label: '3분', labelEn: '3m', yahooInterval: '5m', defaultDays: 1, maxDays: 60 },
  '5m':  { label: '5분', labelEn: '5m', yahooInterval: '5m', defaultDays: 5, maxDays: 60 },
  '10m': { label: '10분', labelEn: '10m', yahooInterval: '15m', defaultDays: 5, maxDays: 60 },
  '30m': { label: '30분', labelEn: '30m', yahooInterval: '30m', defaultDays: 10, maxDays: 60 },
  '1h':  { label: '1시간', labelEn: '1h', yahooInterval: '1h', defaultDays: 30, maxDays: 730 },
  '1d':  { label: '1일', labelEn: '1D', yahooInterval: '1d', defaultDays: 365, maxDays: 3650 },
  '1wk': { label: '1주', labelEn: '1W', yahooInterval: '1wk', defaultDays: 1825, maxDays: 7300 },
  '1mo': { label: '1개월', labelEn: '1M', yahooInterval: '1mo', defaultDays: 3650, maxDays: 7300 },
};

// Legacy type alias for backward compatibility
export type PeriodOption = TickInterval;

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
  interval: TickInterval;
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
