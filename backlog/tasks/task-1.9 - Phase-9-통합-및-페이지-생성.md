---
id: TASK-1.9
title: 'Phase 9: 통합 및 페이지 생성'
status: To Do
assignee: []
created_date: '2026-01-31 07:31'
updated_date: '2026-01-31 07:37'
labels:
  - frontend
  - integration
dependencies: []
parent_task_id: TASK-1
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
모듈 export 정리, 사이드바 메뉴 추가, 페이지 컴포넌트 생성
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 src/features/stock/index.ts 생성 - Public API exports
- [ ] #2 AppSidebar.tsx 수정 - 주식 차트, 종목 비교 메뉴 추가
- [ ] #3 src/app/(admin)/(others-pages)/stock-chart/page.tsx 생성
- [ ] #4 src/app/(admin)/(others-pages)/stock-compare/page.tsx 생성
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/features/stock/index.ts 생성
   - Public API exports:
     // Types
     export type { StockQuote, HistoricalDataPoint, PeriodOption, ... } from "./types"
     // Hooks
     export { useStockData } from "./hooks/useStockData"
     export { useStockCompare } from "./hooks/useStockCompare"
     // Components
     export { StockChartContainer } from "./components/containers/StockChartContainer"
     export { MiniStockChart } from "./components/containers/MiniStockChart"
     export { StockCompareContainer } from "./components/compare/StockCompareContainer"
     export { CandlestickChart, StockLineChart } from "./components/charts"
     export { StockInfoCard, PeriodSelector, StockSearchInput } from "./components/widgets"
     // Utils
     export * from "./utils/formatters"

2. src/layout/AppSidebar.tsx 수정
   - navItems 배열에 추가:
     {
       name: "주식",
       icon: <ChartIcon />,
       subItems: [
         { name: "주식 차트", path: "/stock-chart" },
         { name: "종목 비교", path: "/stock-compare" }
       ]
     }
   - 아이콘 import 추가

3. src/app/(admin)/(others-pages)/stock-chart/page.tsx 생성
   - 메타데이터: title "주식 차트"
   - PageBreadCrumb 컴포넌트
   - StockChartContainer 렌더링
   - 전체 기능 활성화

4. src/app/(admin)/(others-pages)/stock-compare/page.tsx 생성
   - 메타데이터: title "종목 비교"
   - PageBreadCrumb 컴포넌트
   - StockCompareContainer 렌더링
   - 초기 종목 설정 (예: AAPL, MSFT)
<!-- SECTION:PLAN:END -->
