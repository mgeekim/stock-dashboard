---
id: TASK-1.6
title: 'Phase 6: 종목 비교 컴포넌트'
status: To Do
assignee: []
created_date: '2026-01-31 07:31'
updated_date: '2026-01-31 07:35'
labels:
  - frontend
  - chart
dependencies: []
parent_task_id: TASK-1
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
최대 10개 종목을 비교하는 차트 및 UI 컴포넌트 구현
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 src/features/stock/components/compare/StockCompareChart.tsx 생성 - 비교 라인 차트
- [ ] #2 src/features/stock/components/compare/SymbolPicker.tsx 생성 - 종목 추가/제거 UI
- [ ] #3 src/features/stock/components/compare/CompareLegend.tsx 생성 - 종목별 범례
- [ ] #4 src/features/stock/components/compare/StockCompareContainer.tsx 생성 - 비교 기능 컨테이너
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/features/stock/components/compare/StockCompareChart.tsx 생성
   - Props: data (StockCompareData), height
   - 다중 시리즈 라인 차트 렌더링
   - 각 종목별 고유 색상 할당 (10개 색상 팔레트)
   - compareMode에 따른 Y축 포맷팅
     - percent: +10.5%, -5.2%
     - price: $150.00
   - 공통 X축 (날짜)
   - 호버 시 모든 종목 값 표시하는 공유 툴팁

2. src/features/stock/components/compare/SymbolPicker.tsx 생성
   - Props: symbols[], onAdd, onRemove, maxSymbols (기본 10)
   - 검색 입력 필드 + 자동완성 드롭다운
   - 선택된 종목들을 칩(Chip) 형태로 표시
   - 칩에 X 버튼으로 제거 기능
   - 최대 개수 도달 시 입력 비활성화
   - 중복 종목 추가 방지

3. src/features/stock/components/compare/CompareLegend.tsx 생성
   - Props: symbols[], quotes (Record<string, StockQuote>), colors[]
   - 각 종목별 정보 표시:
     - 색상 인디케이터
     - 종목명 (심볼)
     - 현재가
     - 변동률 (+/- 색상)
   - 그리드 레이아웃 (2~3열)

4. src/features/stock/components/compare/StockCompareContainer.tsx 생성
   - 전체 비교 기능 조합
   - useStockCompare 훅 사용
   - 레이아웃: SymbolPicker → PeriodSelector → StockCompareChart → CompareLegend
   - 비교 모드 토글 (percent/price)
   - 로딩/에러 상태 처리
<!-- SECTION:PLAN:END -->
