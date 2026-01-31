---
id: TASK-1
title: 주식 차트 기능 구현
status: Done
assignee: []
created_date: '2026-01-31 07:30'
updated_date: '2026-01-31 12:10'
labels:
  - feature
  - stock
  - chart
dependencies: []
documentation:
  - backlog/docs/doc-1 - 주식-차트-기능-설계.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
프로젝트 전반에서 재사용 가능한 주식 데이터 조회 및 차트 표시 기능 구현. 미국 주식(Yahoo Finance), 한국 주식(KIS API - 껍질만), 종목 비교(최대 10개), 기간 설정(프리셋 + 사용자 지정) 포함.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 타입 정의 완료
- [x] #2 Data Provider 구현 (Yahoo + KIS 껍질)
- [x] #3 API 라우트 구현 (단일 종목 + 비교)
- [x] #4 커스텀 훅 구현 (useStockData, useStockCompare)
- [x] #5 차트 컴포넌트 구현 (캔들스틱, 라인)
- [x] #6 종목 비교 컴포넌트 구현
- [x] #7 위젯 컴포넌트 구현 (PeriodSelector, DateRangePicker 등)
- [x] #8 컨테이너 컴포넌트 구현
- [x] #9 페이지 및 사이드바 통합
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
주식 차트 기능 구현 완료

## 구현 완료 항목

### Phase 1-3: 백엔드
- 타입 정의 (StockQuote, HistoricalDataPoint, PeriodOption 등)
- Yahoo Finance Provider 구현 (미국 주식)
- KIS Provider 껍질 구현 (한국 주식 - TODO)
- API 라우트: /api/stock/[symbol], /api/stock/compare

### Phase 4: 데이터 훅
- useStockData: 단일 종목 데이터 fetching
- useStockCompare: 최대 10개 종목 비교

### Phase 5-8: 프론트엔드 컴포넌트
- Charts: BaseStockChart, CandlestickChart, StockLineChart
- Compare: StockCompareChart, SymbolPicker, CompareLegend, StockCompareContainer
- Widgets: StockInfoCard, PeriodSelector, DateRangePicker, StockSearchInput
- Containers: StockChartContainer, MiniStockChart

### Phase 9: 통합
- 사이드바에 Stock 메뉴 추가
- /stock-chart 페이지
- /stock-compare 페이지
- src/features/stock/index.ts Public API
<!-- SECTION:FINAL_SUMMARY:END -->
