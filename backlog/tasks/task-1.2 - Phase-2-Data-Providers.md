---
id: TASK-1.2
title: 'Phase 2: Data Providers'
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
주식 데이터를 가져오는 Provider 패턴 구현. Yahoo Finance는 완전 구현, KIS API는 인터페이스만 정의
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 src/features/stock/providers/index.ts 생성 - StockDataProvider 인터페이스
- [ ] #2 src/features/stock/providers/yahooProvider.ts 생성 - Yahoo Finance 연동
- [ ] #3 src/features/stock/providers/kisProvider.ts 생성 - 껍질만 (추후 구현)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/features/stock/providers/index.ts 생성
   - StockDataProvider 인터페이스 정의
     - getQuote(symbol: string): Promise<StockQuote>
     - getHistorical(symbol: string, period: PeriodOption, customPeriod?: CustomPeriod): Promise<HistoricalDataPoint[]>
     - search(query: string): Promise<SearchResult[]>
   - getProvider(symbol: string) 팩토리 함수
     - 숫자 6자리 → KIS Provider
     - 영문 → Yahoo Provider
   - isKoreanStock(symbol: string) 헬퍼 함수

2. src/features/stock/providers/yahooProvider.ts 생성
   - yahoo-finance2 라이브러리 사용
   - YahooProvider 클래스 구현
     - getQuote: yahooFinance.quote() 호출
     - getHistorical: yahooFinance.historical() 호출
     - search: yahooFinance.search() 호출
   - 기간별 interval 매핑 (1d→1m, 5d→5m, 1m→1d, 5y→1wk, max→1mo)
   - 에러 핸들링 및 재시도 로직

3. src/features/stock/providers/kisProvider.ts 생성 (껍질만)
   - KISProvider 클래스 구현
   - 모든 메서드에서 "한국 주식은 추후 지원 예정" 에러 throw
   - TODO 주석으로 향후 구현 내용 명시
   - 환경변수 체크 (KIS_APP_KEY, KIS_APP_SECRET)
<!-- SECTION:PLAN:END -->
