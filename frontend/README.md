# frontend

React 19 + Mantine v7 + TypeScript + Vite 기반의 TODO 앱 프론트엔드입니다.

## 기술 스택

- **프레임워크**: React 19
- **UI 라이브러리**: Mantine v7
- **빌드 도구**: Vite
- **언어**: TypeScript
- **테스트**: Jest + React Testing Library
- **E2E 테스트**: Playwright

## 구조

```
src/
├── components/     # UI 컴포넌트
├── contexts/       # React Context (상태 관리)
├── hooks/          # 커스텀 훅
├── models/         # 데이터 모델
├── storage/        # 저장소 어댑터 (LocalStorage)
├── __tests__/      # 테스트 파일
├── App.tsx         # 메인 앱 컴포넌트
└── main.tsx        # 엔트리 포인트
```

## 상태 관리

React Context + useReducer 패턴을 사용합니다.

- [TodoContext.tsx](src/contexts/TodoContext.tsx): 중앙 상태 관리
- [useTodoHooks.tsx](src/hooks/useTodoHooks.tsx): Todo 작업용 커스텀 훅

## 스크립트

```bash
# 개발
npm run dev       # 개발 서버 실행
npm run preview   # 빌드 결과 미리보기

# 빌드
npm run build     # 프로덕션 빌드

# 테스트
npm run test      # Jest 유닛 테스트

# 린트
npm run lint      # ESLint 실행
```

## E2E 테스트 (Playwright)

```bash
# 루트에서 실행
npm run test:e2e          # 기본 E2E 테스트
npm run test:e2e:headed   # 브라우저 UI 표시
npm run test:e2e:debug    # 디버그 모드
```

테스트 파일 위치: `e2e/`

## 개발 규칙

- UI 구현 시 실행 코드 우선 작성, 코어 로직만 TDD
- Mantine UI Kit 사용
- 프레젠테이션/컨테이너 컴포넌트 분리
- 상태 업데이트는 불변성 유지
- 접근성(WCAG 2.1 AA) 준수

## 공유 모듈

타입과 유틸리티는 `@vibecoding-demo/shared` 패키지에서 import합니다.

```typescript
import { Todo, TodoFilter } from '@vibecoding-demo/shared/src/types/todo';
```
