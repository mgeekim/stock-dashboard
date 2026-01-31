---
id: TASK-1.3
title: 'Phase 3: API 라우트'
status: To Do
assignee: []
created_date: '2026-01-31 07:30'
updated_date: '2026-01-31 07:34'
labels:
  - backend
  - api
dependencies: []
parent_task_id: TASK-1
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Next.js API 라우트 구현. 단일 종목 조회 및 종목 비교 엔드포인트
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 src/app/api/stock/[symbol]/route.ts 생성 - 단일 종목 API
- [ ] #2 src/app/api/stock/compare/route.ts 생성 - 종목 비교 API (최대 10개)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/app/api/stock/[symbol]/route.ts 생성
   - GET 핸들러 구현
   - Query params: period (기본값: 1y), startDate, endDate, interval
   - getProvider(symbol)로 적절한 Provider 선택
   - Response 구조:
     {
       success: boolean,
       symbol: string,
       market: "US" | "KR",
       quote: StockQuote,
       historical: HistoricalDataPoint[],
       timestamp: number
     }
   - 에러 응답: { success: false, error: string }
   - Cache-Control 헤더 설정 (5분)

2. src/app/api/stock/compare/route.ts 생성
   - GET 핸들러 구현
   - Query params: symbols (콤마 구분, 최대 10개), period
   - 병렬로 모든 종목 데이터 fetch (Promise.allSettled)
   - Response 구조:
     {
       success: boolean,
       symbols: string[],
       period: PeriodOption,
       quotes: Record<string, StockQuote>,
       historical: Record<string, HistoricalDataPoint[]>,
       errors?: Record<string, string>
     }
   - 10개 초과 시 400 에러 반환
<!-- SECTION:PLAN:END -->
