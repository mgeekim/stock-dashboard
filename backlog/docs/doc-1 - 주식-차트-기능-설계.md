---
id: doc-1
title: 주식 차트 기능 설계
type: design
created_date: '2026-01-31 07:10'
---

## 개요
프로젝트 전반에서 재사용 가능한 주식 데이터 조회 및 차트 표시 기능을 설계합니다.

---

## 1. 데이터 소스

### 미국 주식: Yahoo Finance (yahoo-finance2)
| 항목 | 내용 |
|------|------|
| 비용 | 무료 |
| API 제한 | 공식 제한 없음 (과도한 요청 시 throttle) |
| 지원 데이터 | 실시간 시세, 과거 데이터, 기업 정보 |
| 지원 주식 | 미국 주식 (AAPL, MSFT 등) |

### 한국 주식: KIS Open API (한국투자증권) - 추후 구현
| 항목 | 내용 |
|------|------|
| 비용 | 무료 (계좌 개설 필요) |
| API 제한 | 초당 20회 |
| 지원 데이터 | 실시간 시세, 과거 데이터, 호가 |
| 지원 주식 | KOSPI, KOSDAQ |
| 설정 | APP_KEY, APP_SECRET 환경변수 필요 |

> **Note**: 한국 주식은 Provider 인터페이스만 정의하고, 실제 구현은 추후 진행

**구현 전략**: Provider 패턴으로 데이터 소스 추상화 → 심볼에 따라 적절한 API 선택

---

## 2. 아키텍처 구조

```
src/features/stock/
├── types/
│   └── index.ts              # 타입 정의
├── providers/
│   ├── index.ts              # Provider 인터페이스
│   ├── yahooProvider.ts      # 미국 주식 (Yahoo Finance)
│   └── kisProvider.ts        # 한국 주식 (KIS Open API) - 껍질만
├── hooks/
│   ├── useStockData.ts       # 단일 종목 데이터 조회 훅
│   └── useStockCompare.ts    # 종목 비교 훅 (최대 10개)
├── components/
│   ├── charts/
│   │   ├── BaseStockChart.tsx     # 기본 차트 래퍼
│   │   ├── CandlestickChart.tsx   # 캔들스틱 차트 (기본)
│   │   └── StockLineChart.tsx     # 라인/영역 차트
│   ├── compare/
│   │   ├── StockCompareChart.tsx      # 비교 라인 차트
│   │   ├── StockCompareContainer.tsx  # 비교 기능 컨테이너
│   │   ├── SymbolPicker.tsx           # 종목 추가/제거 UI
│   │   └── CompareLegend.tsx          # 종목별 범례
│   ├── widgets/
│   │   ├── StockInfoCard.tsx      # 시세 정보 카드
│   │   ├── StockSearchInput.tsx   # 종목 검색
│   │   ├── PeriodSelector.tsx     # 기간 선택기 (프리셋 + 사용자 지정)
│   │   └── DateRangePicker.tsx    # 사용자 지정 기간 선택
│   └── containers/
│       ├── StockChartContainer.tsx # 전체 기능 컨테이너
│       └── MiniStockChart.tsx      # 미니 위젯 (대시보드용)
├── utils/
│   ├── formatters.ts         # 숫자/날짜 포맷터
│   └── chartConfig.ts        # ApexCharts 설정
└── index.ts                  # Public API
```

### Provider 패턴 (데이터 소스 추상화)
```typescript
// providers/index.ts
interface StockDataProvider {
  getQuote(symbol: string): Promise<StockQuote>;
  getHistorical(symbol: string, period: PeriodOption): Promise<HistoricalDataPoint[]>;
  search(query: string): Promise<SearchResult[]>;
}

// 심볼 패턴으로 Provider 자동 선택
// - 숫자 6자리 (005930): 한국 주식 → KIS Provider
// - 영문 (AAPL): 미국 주식 → Yahoo Provider
```

---

## 3. 핵심 타입 정의

```typescript
// types/index.ts
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap: number;
  name: string;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 기간 옵션
export type PeriodOption =
  | '1d'   // 1일 (1분봉)
  | '5d'   // 5일 (5분봉)
  | '1m'   // 1개월 (일봉)
  | '3m'   // 3개월 (일봉)
  | '6m'   // 6개월 (일봉)
  | '1y'   // 1년 (일봉)
  | '5y'   // 5년 (주봉)
  | 'max'  // 전체 (월봉)
  | 'custom'; // 사용자 지정

// 사용자 지정 기간
export interface CustomPeriod {
  startDate: string;  // ISO format
  endDate: string;
  interval: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

// 기간별 기본 설정
export const PERIOD_CONFIG: Record<PeriodOption, { label: string; interval: string }> = {
  '1d': { label: '1일', interval: '1m' },
  '5d': { label: '5일', interval: '5m' },
  '1m': { label: '1개월', interval: '1d' },
  '3m': { label: '3개월', interval: '1d' },
  '6m': { label: '6개월', interval: '1d' },
  '1y': { label: '1년', interval: '1d' },
  '5y': { label: '5년', interval: '1wk' },
  'max': { label: '전체', interval: '1mo' },
  'custom': { label: '직접 설정', interval: '1d' },
};
```

---

## 4. 커스텀 훅: useStockData

```typescript
// hooks/useStockData.ts
interface UseStockDataOptions {
  symbol: string;
  period?: PeriodOption;
  autoFetch?: boolean;
}

interface UseStockDataReturn {
  data: StockData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setPeriod: (period: PeriodOption) => void;
  setSymbol: (symbol: string) => void;
}

// 사용 예시
const { data, loading, error, setPeriod } = useStockData({
  symbol: 'AAPL',
  period: '1y'
});
```

---

## 5. 컴포넌트 사용 예시

### 전체 기능 차트 (페이지용)
```tsx
<StockChartContainer
  initialSymbol="AAPL"
  showSearch={true}
  showPeriodSelector={true}
  showInfoCard={true}
  chartType="candlestick"
/>
```

### 미니 차트 (대시보드 위젯용)
```tsx
<MiniStockChart
  symbol="AAPL"
  period="1m"
  height={150}
  showPrice={true}
/>
```

### 훅만 사용 (커스텀 UI)
```tsx
const { data, loading } = useStockData({ symbol: 'AAPL' });

return (
  <div>
    {loading ? <Spinner /> : <CustomChart data={data} />}
  </div>
);
```

### 종목 비교 차트 (최대 10개)
```tsx
<StockCompareChart
  symbols={['AAPL', 'MSFT', 'GOOGL', 'AMZN']}
  period="1y"
  compareMode="percent"  // 'percent' | 'price'
  height={400}
/>
```

---

## 5-1. 종목 비교 기능

### 개요
동일한 기간 동안 최대 10개 종목의 가격 변동을 비교하는 기능

### 비교 모드
| 모드 | 설명 |
|------|------|
| `percent` | 시작 시점 대비 변동률(%) 비교 (기본값) |
| `price` | 절대 가격 비교 |

### 타입 정의
```typescript
// types/index.ts
export interface CompareDataPoint {
  date: string;
  values: Record<string, number>;  // { AAPL: 150.5, MSFT: 380.2, ... }
}

export interface StockCompareData {
  symbols: string[];
  period: PeriodOption;
  compareMode: 'percent' | 'price';
  data: CompareDataPoint[];
  quotes: Record<string, StockQuote>;
}
```

### 커스텀 훅: useStockCompare
```typescript
interface UseStockCompareOptions {
  symbols: string[];      // 최대 10개
  period?: PeriodOption;
  compareMode?: 'percent' | 'price';
}

interface UseStockCompareReturn {
  data: StockCompareData | null;
  loading: boolean;
  error: string | null;
  addSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
  setPeriod: (period: PeriodOption) => void;
  setCompareMode: (mode: 'percent' | 'price') => void;
}

// 사용 예시
const { data, addSymbol, removeSymbol } = useStockCompare({
  symbols: ['AAPL', 'MSFT'],
  period: '1y',
  compareMode: 'percent'
});
```

### 컴포넌트 구조
```
src/features/stock/components/
├── compare/
│   ├── StockCompareChart.tsx      # 비교 라인 차트
│   ├── StockCompareContainer.tsx  # 전체 비교 기능 컨테이너
│   ├── SymbolPicker.tsx           # 종목 추가/제거 UI
│   └── CompareLegend.tsx          # 종목별 범례 (색상, 현재가, 변동률)
```

### API 라우트
```typescript
// GET /api/stock/compare?symbols=AAPL,MSFT,GOOGL&period=1y

// Response
{
  success: true,
  symbols: ["AAPL", "MSFT", "GOOGL"],
  quotes: { ... },
  historical: {
    "AAPL": [...],
    "MSFT": [...],
    "GOOGL": [...]
  }
}
```

---

## 6. API 라우트

### GET /api/stock/[symbol]
```typescript
// src/app/api/stock/[symbol]/route.ts
// Query: ?period=1y

// 심볼 형식에 따라 자동으로 적절한 Provider 선택
// - AAPL → Yahoo Finance
// - 005930 → KIS Open API

// Response
{
  success: true,
  symbol: "AAPL",
  market: "US",  // "US" | "KR"
  quote: { ... },
  historical: [ ... ]
}
```

### 환경변수 (.env.local)
```
# 한국 주식 (KIS Open API)
KIS_APP_KEY=your_app_key
KIS_APP_SECRET=your_app_secret
KIS_ACCOUNT_NO=your_account_number
```

---

## 7. 구현 순서

### Phase 1: 기반 구축
1. `src/features/stock/types/index.ts` - 타입 정의 (비교 기능 타입 포함)
2. `src/features/stock/utils/formatters.ts` - 포맷터 유틸
3. `src/features/stock/utils/chartConfig.ts` - ApexCharts 기본 설정

### Phase 2: Data Providers
4. `src/features/stock/providers/index.ts` - Provider 인터페이스
5. `src/features/stock/providers/yahooProvider.ts` - 미국 주식 (Yahoo Finance)
6. `src/features/stock/providers/kisProvider.ts` - 한국 주식 (껍질만, 추후 구현)

### Phase 3: API
7. `src/app/api/stock/[symbol]/route.ts` - 단일 종목 API
8. `src/app/api/stock/compare/route.ts` - 종목 비교 API (최대 10개)

### Phase 4: 데이터 레이어
9. `src/features/stock/hooks/useStockData.ts` - 단일 종목 훅
10. `src/features/stock/hooks/useStockCompare.ts` - 종목 비교 훅

### Phase 5: 차트 컴포넌트
11. `src/features/stock/components/charts/BaseStockChart.tsx`
12. `src/features/stock/components/charts/CandlestickChart.tsx` - 캔들스틱 (기본)
13. `src/features/stock/components/charts/StockLineChart.tsx`

### Phase 6: 종목 비교 컴포넌트
14. `src/features/stock/components/compare/StockCompareChart.tsx`
15. `src/features/stock/components/compare/SymbolPicker.tsx`
16. `src/features/stock/components/compare/CompareLegend.tsx`
17. `src/features/stock/components/compare/StockCompareContainer.tsx`

### Phase 7: 위젯
18. `src/features/stock/components/widgets/StockInfoCard.tsx`
19. `src/features/stock/components/widgets/PeriodSelector.tsx` - 프리셋 + 사용자 지정
20. `src/features/stock/components/widgets/DateRangePicker.tsx` - flatpickr 기반
21. `src/features/stock/components/widgets/StockSearchInput.tsx`

### Phase 8: 컨테이너
22. `src/features/stock/components/containers/StockChartContainer.tsx`
23. `src/features/stock/components/containers/MiniStockChart.tsx`

### Phase 9: 통합
24. `src/features/stock/index.ts` - Public exports
25. 사이드바 메뉴 추가 (주식 차트, 종목 비교)
26. 주식 차트 페이지 생성
27. 종목 비교 페이지 생성

---

## 7-1. 기간 설정 기능

### PeriodSelector 컴포넌트
```tsx
interface PeriodSelectorProps {
  value: PeriodOption;
  onChange: (period: PeriodOption) => void;
  showCustom?: boolean;  // 사용자 지정 기간 표시 여부
  customPeriod?: CustomPeriod;
  onCustomChange?: (period: CustomPeriod) => void;
}

// 사용 예시
<PeriodSelector
  value={period}
  onChange={setPeriod}
  showCustom={true}
  customPeriod={customPeriod}
  onCustomChange={setCustomPeriod}
/>
```

### 사용자 지정 기간 UI
- DateRangePicker (flatpickr 활용)
- 시작일 / 종료일 선택
- 봉 간격 선택 (1분, 5분, 1시간, 일, 주, 월)

---

## 7-2. 추가 고려 기능 (향후 확장)

### 1. 기술적 지표 (Technical Indicators)
| 지표 | 설명 | 우선순위 |
|------|------|----------|
| MA (이동평균) | 5일, 20일, 60일, 120일 | 높음 |
| 볼린저 밴드 | 변동성 표시 | 중간 |
| RSI | 과매수/과매도 지표 | 중간 |
| MACD | 추세 전환 시그널 | 낮음 |

### 2. 관심 종목 (Watchlist)
- 로컬스토리지에 저장
- 대시보드 위젯으로 표시
- 빠른 종목 전환

### 3. 차트 내보내기
| 형식 | 설명 |
|------|------|
| PNG | 차트 이미지 저장 |
| CSV | 데이터 다운로드 |

### 4. 실시간 업데이트
- 자동 새로고침 간격 설정 (30초, 1분, 5분)
- 장 마감 시 자동 중지

### 5. 차트 설정 저장
- 선호 차트 타입 (캔들스틱/라인)
- 기본 기간
- 표시 지표
- 테마/색상 설정

### 6. 키보드 단축키
| 단축키 | 동작 |
|--------|------|
| `←` / `→` | 기간 이동 |
| `+` / `-` | 줌 인/아웃 |
| `1-8` | 기간 빠른 전환 |
| `F` | 전체화면 |

### 7. 알림 기능 (추후)
- 목표가 도달 알림
- 변동률 알림
- 브라우저 푸시 알림

---

## 8. 기존 패턴 적용

- **차트 라이브러리**: ApexCharts (react-apexcharts)
- **SSR 처리**: `dynamic(() => import('react-apexcharts'), { ssr: false })`
- **스타일링**: Tailwind CSS, 다크모드 지원
- **폰트**: Outfit, sans-serif
- **색상**: Brand Blue (#465FFF), Green (#10B981), Red (#EF4444)

---

## 9. 검증 방법

1. 개발 서버 실행: `npm run dev`
2. 주식 차트 페이지 접속
3. 종목 검색 테스트 (AAPL, MSFT, GOOGL 등)
4. 기간 변경 테스트 (1개월, 3개월, 1년 등)
5. 다크모드 전환 확인
6. 대시보드에 미니 차트 위젯 추가 테스트

---

## 10. 참고 파일

- `/src/components/charts/line/LineChartOne.tsx` - ApexCharts 패턴
- `/src/context/ThemeContext.tsx` - Context 패턴
- `/src/components/ecommerce/StatisticsChart.tsx` - 인터랙티브 차트 예시
