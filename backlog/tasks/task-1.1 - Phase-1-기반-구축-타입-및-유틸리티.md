---
id: TASK-1.1
title: 'Phase 1: 기반 구축 - 타입 및 유틸리티'
status: Done
assignee:
  - '@claude'
created_date: '2026-01-31 07:30'
updated_date: '2026-01-31 07:45'
labels:
  - setup
dependencies: []
parent_task_id: TASK-1
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
주식 차트 기능의 기반이 되는 타입 정의와 유틸리티 함수 구현
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 src/features/stock/types/index.ts 생성 - StockQuote, HistoricalDataPoint, PeriodOption 등
- [x] #2 src/features/stock/utils/formatters.ts 생성 - 가격, 거래량, 날짜 포맷터
- [x] #3 src/features/stock/utils/chartConfig.ts 생성 - ApexCharts 기본 설정
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/features/stock/types/index.ts 생성
   - StockQuote 인터페이스 (symbol, price, change, changePercent, open, dayHigh, dayLow, volume, fiftyTwoWeekHigh, fiftyTwoWeekLow, marketCap, name)
   - HistoricalDataPoint 인터페이스 (date, open, high, low, close, volume)
   - PeriodOption 타입 (1d, 5d, 1m, 3m, 6m, 1y, 5y, max, custom)
   - CustomPeriod 인터페이스 (startDate, endDate, interval)
   - PERIOD_CONFIG 상수 (기간별 라벨, 봉 간격)
   - CompareDataPoint, StockCompareData 인터페이스 (비교 기능용)
   - FetchState<T> 제네릭 타입 (data, loading, error)

2. src/features/stock/utils/formatters.ts 생성
   - formatPrice(price: number, currency?: string) - 가격 포맷 ($1,234.56)
   - formatVolume(volume: number) - 거래량 포맷 (1.2M, 500K)
   - formatMarketCap(cap: number) - 시가총액 포맷 (1.5T, 200B)
   - formatPercent(value: number) - 퍼센트 포맷 (+2.34%, -1.23%)
   - formatDate(date: string, format?: string) - 날짜 포맷

3. src/features/stock/utils/chartConfig.ts 생성
   - getBaseChartOptions() - 공통 ApexCharts 옵션
   - getCandlestickOptions() - 캔들스틱 차트 옵션
   - getLineChartOptions() - 라인 차트 옵션
   - getVolumeChartOptions() - 거래량 차트 옵션
   - CHART_COLORS 상수 - 차트 색상 (up: #10B981, down: #EF4444, line: #465FFF)
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Phase 1 기반 구축 완료

생성된 파일:
- src/features/stock/types/index.ts: 타입 정의 (StockQuote, HistoricalDataPoint, PeriodOption, CompareDataPoint 등)
- src/features/stock/utils/formatters.ts: 포맷터 유틸리티 (formatPrice, formatVolume, formatMarketCap, formatPercent, formatDate 등)
- src/features/stock/utils/chartConfig.ts: ApexCharts 설정 (getBaseChartOptions, getCandlestickOptions, getLineChartOptions, getVolumeChartOptions, getCompareChartOptions)

주요 구현:
- 9개 기간 옵션 (1d, 5d, 1m, 3m, 6m, 1y, 5y, max, custom)
- 다크모드 지원 차트 설정
- 한국어 날짜/숫자 포맷팅
- 10개 종목 비교를 위한 색상 팔레트
<!-- SECTION:FINAL_SUMMARY:END -->
