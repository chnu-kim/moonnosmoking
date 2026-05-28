# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
pnpm dev          # 개발 서버 (http://localhost:3000)
pnpm build        # 정적 빌드 → out/
pnpm test         # 전체 테스트
pnpm test:watch   # 테스트 watch 모드
```

특정 테스트 파일만 실행:
```bash
pnpm vitest run src/lib/__tests__/challenge.test.ts
```

## 아키텍처

### 정적 배포 구조

`next.config.ts`에서 `output: "export"`, `basePath: "/moonnosmoking"`으로 설정돼 있어 GitHub Pages 정적 배포를 전제로 한다. 모든 링크와 URL은 `/moonnosmoking/` 접두어를 포함해야 한다. `buildOverlayUrl()`이 이 prefix를 하드코딩하고 있으므로 basePath 변경 시 함께 수정해야 한다.

### 데이터 흐름

챌린지 로직(`src/lib/challenge.ts`)이 유일한 진실의 근원이다. `CONFIG`에서 `START_DATE`와 `TOTAL_DAYS`를 읽어 `getCurrentDay()`, `getChallengeStatus()`, `calcProgress()` 등을 도출한다.

- **상태는 두 가지뿐**: `"before"` | `"ongoing"` — 삼덕이 프로젝트와 달리 `"success"` 상태가 없다. 31일(TOTAL_DAYS) 이후에도 챌린지는 `ongoing`으로 계속 카운트된다. `calcProgress()`는 31일 기준으로 최대 100%에 클램핑된다.

### 오버레이 렌더링 파이프라인

```
/overlay/?template=...&fg=...  →  page.tsx (Suspense)
                                →  OverlayInner.tsx (useSearchParams)
                                    ├─ parseOverlayParams()   URL 파라미터 → OverlayParams
                                    ├─ calculateOverlayState() → OverlayState
                                    └─ CSS 변수 주입 후 템플릿 컴포넌트 선택
```

`OverlayInner`는 두 가지 파라미터 소스를 병합한다: URL 쿼리스트링(기본값) + `postMessage`로 주입되는 프리뷰 오버라이드. 커스터마이즈 페이지의 iframe이 `OVERLAY_PARAMS_UPDATE` 메시지로 실시간 반영한다.

### CSS 변수 → 템플릿

각 오버레이 템플릿은 `--overlay-fg`, `--overlay-bg`, `--overlay-font` CSS 변수만 소비하며, 구체적인 색상 계산은 `OverlayInner`가 `resolveBg()`를 통해 완료하고 넘긴다. 템플릿 컴포넌트는 `OverlayParams`(표현 설정)와 `OverlayState`(챌린지 데이터)를 props로 받는다.

### 스타일링 분리

- `src/app/globals.css` — 메인 페이지(`/`)용 CSS 변수 및 클래스
- `src/app/overlay/overlay.css` — OBS 오버레이 전용 스타일. 메인 페이지 스타일과 완전히 분리돼 있고 overlay layout에서만 import된다

### 테스트 범위

`src/lib/` 의 순수 함수만 테스트한다. React 컴포넌트 테스트는 없다. `getCurrentDay()`, `getChallengeStatus()`처럼 `Date.now()`에 의존하는 함수는 테스트하지 않고, `calcProgress()`, `msToComponents()` 같은 결정론적 함수만 커버한다.

## 챌린지 설정 변경

`src/lib/challenge.ts`의 `CONFIG` 객체만 수정하면 된다:

```ts
export const CONFIG = {
  START_DATE: "2026-05-13T00:00:00+09:00",  // ISO 8601, 한국 시간(+09:00)
  TOTAL_DAYS: 31,   // 진행률 기준일. 이후에도 카운트는 계속됨
  PARTICIPANT: "문서희",
} as const;
```

## 템플릿 추가

1. `src/app/overlay/templates/`에 컴포넌트 추가 (`Props: { params, state, cssVars }`)
2. `src/lib/overlayParams.ts`의 `OverlayTemplate` 타입과 `VALID_TEMPLATES` 배열에 값 추가
3. `src/app/overlay/OverlayInner.tsx`의 switch문에 케이스 추가
4. `src/app/overlay/customize/page.tsx`의 `TEMPLATES` 배열에 label 추가
