---
id: TASK-1.3
title: 'Phase 3: API 라우트'
status: Done
assignee:
  - '@claude'
created_date: '2026-01-31 07:30'
updated_date: '2026-01-31 07:50'
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
- [x] #1 src/app/api/stock/[symbol]/route.ts 생성 - 단일 종목 API
- [x] #2 src/app/api/stock/compare/route.ts 생성 - 종목 비교 API (최대 10개)
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

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Phase 3 API 라우트 완료

생성된 파일:
- src/app/api/stock/[symbol]/route.ts: 단일 종목 API
- src/app/api/stock/compare/route.ts: 종목 비교 API

단일 종목 API (GET /api/stock/[symbol]):
- Query: period, startDate, endDate, interval
- 병렬로 시세(quote) + 과거데이터(historical) 조회
- 5분 캐시 설정 (Cache-Control)
- 에러 코드: 404 (NOT_FOUND), 501 (NOT_IMPLEMENTED), 500 (기타)

종목 비교 API (GET /api/stock/compare):
- Query: symbols (콤마 구분, 최대 10개), period
- Promise.allSettled로 병렬 조회
- 부분 성공 지원 (일부 실패해도 성공한 데이터 반환)
- errors 필드에 실패 종목 정보 포함
<!-- SECTION:FINAL_SUMMARY:END -->
