---
id: TASK-1.8
title: 'Phase 8: 컨테이너 컴포넌트'
status: Done
assignee:
  - '@claude'
created_date: '2026-01-31 07:31'
updated_date: '2026-01-31 12:07'
labels:
  - frontend
dependencies: []
parent_task_id: TASK-1
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
전체 기능을 조합한 컨테이너 컴포넌트 구현
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 src/features/stock/components/containers/StockChartContainer.tsx 생성 - 전체 기능 컨테이너
- [x] #2 src/features/stock/components/containers/MiniStockChart.tsx 생성 - 대시보드용 미니 위젯
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/features/stock/components/containers/StockChartContainer.tsx 생성
   - Props:
     - initialSymbol (기본: "AAPL")
     - initialPeriod (기본: "1y")
     - chartType ("candlestick" | "line")
     - showSearch, showPeriodSelector, showInfoCard, showVolume
     - onSymbolChange 콜백
   - useStockData 훅 사용
   - 레이아웃 구성:
     - 헤더: StockSearchInput + PeriodSelector
     - 정보: StockInfoCard (showInfoCard=true 시)
     - 차트: CandlestickChart 또는 StockLineChart
     - 하단: 거래량 차트 (showVolume=true 시)
   - 차트 타입 전환 버튼
   - 로딩/에러 상태 UI
   - ComponentCard 래퍼 사용

2. src/features/stock/components/containers/MiniStockChart.tsx 생성
   - Props: symbol, period, height, showPrice, showChange, chartType
   - 대시보드 위젯용 컴팩트 버전
   - useStockData 훅 사용
   - 심플한 UI:
     - 종목명 + 현재가 (상단)
     - 변동률 배지
     - 미니 라인/영역 차트
   - 클릭 시 상세 페이지 이동 (Link)
   - 툴바/그리드 숨김
   - 최소 높이 처리
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Phase 8: 컨테이너 컴포넌트 구현 완료

## 구현 내용

### StockChartContainer.tsx
전체 기능 통합 컨테이너
- useStockData 훅 사용
- StockSearchInput, PeriodSelector, StockInfoCard, Chart 통합
- 차트 타입 토글 (candlestick/line/area)
- ComponentCard 래퍼 사용
- 각 영역별 표시 옵션 (showSearch, showPeriodSelector 등)

### MiniStockChart.tsx
대시보드용 미니 위젯
- sparkline 모드 ApexCharts
- 종목명, 현재가, 변동률 배지 표시
- 상승/하락에 따른 차트 색상 변경
- 선택적 링크 (href prop)
- 로딩/에러 상태 처리

### components/index.ts
모든 컴포넌트 re-export
<!-- SECTION:FINAL_SUMMARY:END -->
