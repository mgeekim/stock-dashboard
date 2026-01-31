---
id: TASK-1.7
title: 'Phase 7: 위젯 컴포넌트'
status: Done
assignee:
  - '@claude'
created_date: '2026-01-31 07:31'
updated_date: '2026-01-31 12:05'
labels:
  - frontend
  - ui
dependencies: []
parent_task_id: TASK-1
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
주식 차트에서 사용되는 공통 위젯 컴포넌트 구현
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 src/features/stock/components/widgets/StockInfoCard.tsx 생성 - 시세 정보 카드
- [x] #2 src/features/stock/components/widgets/PeriodSelector.tsx 생성 - 기간 선택기 (프리셋 + 사용자 지정)
- [x] #3 src/features/stock/components/widgets/DateRangePicker.tsx 생성 - flatpickr 기반 날짜 범위 선택
- [x] #4 src/features/stock/components/widgets/StockSearchInput.tsx 생성 - 종목 검색 입력
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/features/stock/components/widgets/StockInfoCard.tsx 생성
   - Props: quote (StockQuote), symbol, compact
   - 표시 정보:
     - 종목명, 심볼
     - 현재가 (큰 폰트)
     - 변동폭/변동률 (색상 배지)
     - compact=false 시 추가 정보:
       - 시가, 고가, 저가, 거래량
       - 52주 최고/최저
       - 시가총액
   - formatters 유틸 활용
   - 다크모드 스타일링

2. src/features/stock/components/widgets/PeriodSelector.tsx 생성
   - Props: value, onChange, showCustom, customPeriod, onCustomChange
   - 프리셋 버튼 그룹 (1일, 5일, 1개월, 3개월, 6개월, 1년, 5년, 전체)
   - 활성 버튼 하이라이트
   - showCustom=true 시 "직접 설정" 버튼 추가
   - 직접 설정 클릭 시 DateRangePicker 모달/드롭다운 표시
   - PERIOD_CONFIG 활용

3. src/features/stock/components/widgets/DateRangePicker.tsx 생성
   - Props: startDate, endDate, interval, onChange, onClose
   - flatpickr 라이브러리 활용 (기존 프로젝트 패턴)
   - 시작일/종료일 선택
   - 봉 간격 선택 드롭다운 (1분, 5분, 1시간, 일, 주, 월)
   - 적용/취소 버튼
   - 최대 기간 제한 로직 (간격별)

4. src/features/stock/components/widgets/StockSearchInput.tsx 생성
   - Props: value, onChange, onSubmit, onSelect, placeholder, loading
   - 검색 아이콘 + 입력 필드
   - Enter 키 또는 버튼 클릭으로 검색
   - 자동완성 드롭다운 (선택적)
   - 로딩 스피너 표시
   - 최근 검색 기록 (로컬스토리지)
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Phase 7: 위젯 컴포넌트 구현 완료

## 구현 내용

### StockInfoCard.tsx
시세 정보 카드
- 종목명, 현재가, 변동폭/변동률 표시
- compact 모드와 상세 모드 지원
- 상세 모드: 시가/고가/저가, 거래량, 시가총액, 52주 최고/최저
- formatters 유틸 활용

### PeriodSelector.tsx
기간 선택기
- 프리셋 버튼 (1D, 5D, 1M, 3M, 6M, 1Y, 5Y, MAX)
- showCustom 옵션으로 직접 설정 버튼 표시
- DateRangePicker 모달 연동

### DateRangePicker.tsx
flatpickr 기반 날짜 범위 선택
- 시작일/종료일 선택
- 봉 간격 선택 (1분, 1시간, 일, 주, 월)
- 간격별 최대 기간 제한 유효성 검사

### StockSearchInput.tsx
종목 검색 입력
- 검색 아이콘 + 입력 필드 + 검색 버튼
- 최근 검색 기록 (로컬스토리지, 최대 5개)
- 로딩 스피너 표시
<!-- SECTION:FINAL_SUMMARY:END -->
