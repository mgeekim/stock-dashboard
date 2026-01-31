---
id: TASK-1.4
title: 'Phase 4: 커스텀 훅'
status: To Do
assignee: []
created_date: '2026-01-31 07:30'
updated_date: '2026-01-31 07:35'
labels:
  - frontend
  - hooks
dependencies: []
parent_task_id: TASK-1
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
데이터 fetching을 위한 React 커스텀 훅 구현
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 src/features/stock/hooks/useStockData.ts 생성 - 단일 종목 데이터 훅
- [ ] #2 src/features/stock/hooks/useStockCompare.ts 생성 - 종목 비교 훅 (최대 10개)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/features/stock/hooks/useStockData.ts 생성
   - Options 인터페이스: symbol, period, customPeriod, autoFetch
   - Return 인터페이스: data, loading, error, refetch, setPeriod, setSymbol
   - useState로 상태 관리 (stockData, loading, error)
   - useEffect로 symbol/period 변경 시 자동 fetch
   - useCallback으로 refetch, setPeriod, setSymbol 메모이제이션
   - AbortController로 요청 취소 처리
   - 에러 핸들링 (네트워크 오류, API 오류)

2. src/features/stock/hooks/useStockCompare.ts 생성
   - Options 인터페이스: symbols[], period, compareMode
   - Return 인터페이스: data, loading, error, addSymbol, removeSymbol, setPeriod, setCompareMode
   - 최대 10개 종목 제한 로직
   - addSymbol: 중복 체크 후 추가
   - removeSymbol: 배열에서 제거
   - 퍼센트 변환 로직 (compareMode === "percent")
     - 각 종목의 시작가 대비 변동률 계산
   - useMemo로 변환된 데이터 캐싱
<!-- SECTION:PLAN:END -->
