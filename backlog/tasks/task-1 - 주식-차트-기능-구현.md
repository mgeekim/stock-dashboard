---
id: TASK-1
title: 주식 차트 기능 구현
status: To Do
assignee: []
created_date: '2026-01-31 07:30'
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
- [ ] #1 타입 정의 완료
- [ ] #2 Data Provider 구현 (Yahoo + KIS 껍질)
- [ ] #3 API 라우트 구현 (단일 종목 + 비교)
- [ ] #4 커스텀 훅 구현 (useStockData, useStockCompare)
- [ ] #5 차트 컴포넌트 구현 (캔들스틱, 라인)
- [ ] #6 종목 비교 컴포넌트 구현
- [ ] #7 위젯 컴포넌트 구현 (PeriodSelector, DateRangePicker 등)
- [ ] #8 컨테이너 컴포넌트 구현
- [ ] #9 페이지 및 사이드바 통합
<!-- AC:END -->
