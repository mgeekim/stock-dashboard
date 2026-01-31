---
id: TASK-1.5
title: 'Phase 5: 차트 컴포넌트'
status: Done
assignee:
  - '@claude'
created_date: '2026-01-31 07:31'
updated_date: '2026-01-31 11:58'
labels:
  - frontend
  - chart
dependencies: []
parent_task_id: TASK-1
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
ApexCharts 기반 주식 차트 컴포넌트 구현
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 src/features/stock/components/charts/BaseStockChart.tsx 생성 - SSR-safe 차트 래퍼
- [x] #2 src/features/stock/components/charts/CandlestickChart.tsx 생성 - OHLC 캔들스틱 차트
- [x] #3 src/features/stock/components/charts/StockLineChart.tsx 생성 - 라인/영역 차트
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/features/stock/components/charts/BaseStockChart.tsx 생성
   - "use client" 지시문
   - dynamic import로 react-apexcharts 로드 (ssr: false)
   - Props: series, options, type, height, className, loading, error
   - useTheme() 훅으로 다크모드 감지
   - 다크모드 시 차트 색상 자동 전환
   - 로딩 시 Skeleton UI 표시
   - 에러 시 에러 메시지 표시
   - overflow-x-auto 래퍼로 반응형 처리

2. src/features/stock/components/charts/CandlestickChart.tsx 생성
   - Props: data (HistoricalDataPoint[]), symbol, showVolume, height
   - data를 ApexCharts 캔들스틱 형식으로 변환
     - x: timestamp, y: [open, high, low, close]
   - 옵션 설정:
     - plotOptions.candlestick.colors (up: #10B981, down: #EF4444)
     - 툴바 표시 (zoom, pan, download)
     - tooltip에 OHLC 정보 포맷팅
   - showVolume=true 시 하단에 VolumeChart 표시

3. src/features/stock/components/charts/StockLineChart.tsx 생성
   - Props: data, symbol, valueKey (close|open|high|low), filled, height, color
   - 라인/영역 차트 렌더링
   - filled=true 시 그라데이션 영역 차트
   - 간단한 툴팁 (날짜, 가격)
   - 반응형 높이 처리
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Phase 5: ApexCharts 기반 차트 컴포넌트 구현 완료

## 구현 내용

### BaseStockChart.tsx
SSR-safe 차트 래퍼 컴포넌트
- dynamic import로 react-apexcharts 로드 (ssr: false)
- useTheme()으로 다크모드 자동 감지 및 스타일 적용
- 로딩 시 Skeleton UI, 에러 시 에러 메시지 표시
- overflow-x-auto로 반응형 처리

### CandlestickChart.tsx
OHLC 캔들스틱 차트
- HistoricalDataPoint[]를 ApexCharts 형식으로 변환
- showVolume 옵션으로 하단 거래량 차트 표시
- 툴바 (zoom, pan, download) 제공
- 커스텀 툴팁 (OHLC 정보 포맷팅)

### StockLineChart.tsx
라인/영역 차트
- valueKey로 표시할 값 선택 (close/open/high/low)
- filled 옵션으로 그라데이션 영역 차트 전환
- color 옵션으로 개별 색상 지정 가능
<!-- SECTION:FINAL_SUMMARY:END -->
