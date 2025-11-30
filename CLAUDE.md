# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

Korean for all communication (커뮤니케이션은 한국어).
IaC 코드의 클라우드 리소스 Description은 영문으로 작성.

## Build & Test Commands

```bash
# Root-level commands (npm workspaces)
npm run frontend:dev      # Start frontend dev server (Vite)
npm run frontend:build    # Build frontend
npm run frontend:test     # Run frontend tests (Jest)
npm run frontend:lint     # Lint frontend

npm run backend:build     # Build backend (TypeScript)
npm run backend:test      # Run backend tests (Jest)
npm run backend:lint      # Lint backend

npm run shared:build      # Build shared module
npm run shared:test       # Run shared module tests

# CDK commands
npm run cdk:synth         # Synthesize CDK stacks
npm run cdk:deploy        # Deploy to AWS
npm run cdk:destroy       # Destroy AWS resources

# Run single test (from package directory)
cd frontend && npx jest <test-file>
cd backend && npx jest <test-file>

# E2E tests
cd frontend && npx playwright test
```

## Pre-commit Hook Behavior

When committing changes to `frontend/src/**/*.{js,ts,tsx}` or `backend/{src,lib,bin}/**/*.ts`, the pre-commit hook automatically runs lint fix → build → test. All must pass for the commit to succeed. **Never use `--no-verify`**.

## Architecture Overview

**Monorepo structure** with npm workspaces:
- `frontend/` - React 19 + Mantine v7 + Vite + TypeScript
- `backend/` - Node.js + TypeScript + AWS CDK (Lambda, DynamoDB, Cognito, API Gateway)
- `shared/` - Shared types, constants, utilities (`@vibecoding-demo/shared`)

### Frontend Architecture

State management via React Context + useReducer pattern:
- [TodoContext.tsx](frontend/src/contexts/TodoContext.tsx) - Central state management
- [useTodoHooks.tsx](frontend/src/hooks/useTodoHooks.tsx) - Custom hooks for todo operations
- Types imported from `@vibecoding-demo/shared/src/types/todo`
- LocalStorage adapter for persistence: [LocalStorageAdapter.ts](frontend/src/storage/LocalStorageAdapter.ts)

### Backend Architecture (Clean Architecture)

```
backend/src/
├── domain/          # Entities & repository interfaces
│   ├── todo/        # Todo entity, repository interface, usecase interface
│   └── user/        # User entity, auth/user repository interfaces
├── application/     # Usecase implementations
├── infrastructure/  # External service adapters
│   ├── dynamodb/    # DynamoDB repository implementations
│   └── cognito/     # Cognito auth repository implementation
├── interfaces/rest/ # REST API controllers
├── main/            # Application entry points (handlers)
└── lambda/          # Lambda function entry points
```

CDK stacks in `backend/lib/`:
- `api/` - API Gateway stack
- `auth/` - Cognito stack
- `database/` - DynamoDB stack
- `lambda/` - Lambda function stack

### Dependency Direction

Domain ← Application ← Infrastructure/Interfaces. Inner layers never depend on outer layers.

## Implementation Rules

### TDD & Architecture
- 비즈니스 로직 구현은 반드시 테스트를 먼저 작성 (TDD)
- SOLID 원칙과 Clean Architecture 적용
- 테스트 커버리지 80% 이상 유지
- 가능한 최신 버전의 라이브러리 사용

### Code Quality
- 단순성 우선: 복잡한 솔루션보다 가장 단순한 솔루션
- DRY 원칙: 코드 중복 피하고 기존 기능 재사용
- 테스트 외에는 모의 데이터 사용 금지
- 조기 반환(early return)으로 가독성 향상

### TypeScript Conventions
- 타입보다 인터페이스(interface) 선호
- enum 대신 const 맵 사용
- `satisfies` 연산자로 타입 검증
- 명명 규칙:
  - 보조 동사 포함 (isLoading, hasError)
  - 이벤트 핸들러에 "handle" 접두사 (handleClick, handleSubmit)
  - 디렉토리는 소문자와 대시 (components/todo-list)
  - named exports 선호

### Refactoring
- 리팩토링 전 계획 설명하고 허락 받기
- 기능 변경 없이 코드 구조만 개선
- 리팩토링 후 모든 테스트 통과 확인

### Debugging
- 디버깅 시 원인 및 해결책 설명하고 허락 받기
- 원인 불명확 시 상세 로그 추가
- 에러 해결보다 제대로 동작하는 것이 중요

## Frontend Rules

- UI 구현 시 실행 코드 먼저 작성, 코어 로직만 TDD
- Mantine UI Kit 사용
- 프레젠테이션/컨테이너 컴포넌트 분리
- 상태 업데이트는 불변성 유지
- 접근성(WCAG 2.1 AA) 준수

## Backend Rules

- RESTful API 원칙 준수
- DynamoDB 단일 테이블 디자인 적용
- Lambda 함수는 Clean Architecture 패턴 적용
- 의존성 주입을 통한 결합도 감소

## Commit Message Convention

```
<type>: <description>

- Detail 1
- Detail 2
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

순서: 문서화 → 리팩토링 → 기능 추가 → 버그 수정

## Naming Conventions

### Code Naming
- **변수/함수**: camelCase, 보조 동사 포함 (`isLoading`, `hasError`, `canSubmit`)
- **이벤트 핸들러**: `handle` 접두사 (`handleClick`, `handleSubmit`)
- **컴포넌트**: PascalCase (`TodoItem`, `UserProfile`)
- **상수**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `API_BASE_URL`)
- **인터페이스/타입**: PascalCase, `I` 접두사 없이 (`TodoProps`, `UserState`)
- **디렉토리**: 소문자와 대시 (`todo-list`, `user-profile`)
- **파일**: 컴포넌트는 PascalCase, 그 외 camelCase (`TodoItem.tsx`, `todoUtils.ts`)

### Git Branch Naming
형식: `<type>/<issue-number>-<설명>`

- **기능 개발**: `feat/<issue>-<설명>` (예: `feat/123-user-authentication`)
- **버그 수정**: `fix/<issue>-<설명>` (예: `fix/456-login-error`)
- **리팩토링**: `refactor/<issue>-<설명>` (예: `refactor/789-todo-context`)
- **문서**: `docs/<issue>-<설명>` (예: `docs/101-api-guide`)
- **핫픽스**: `hotfix/<issue>-<설명>` (예: `hotfix/999-critical-bug`)

GitHub Issue 연동:
- 모든 작업 브랜치는 반드시 GitHub Issue 번호 포함
- 브랜치 생성 전 `gh issue create` 또는 기존 issue 확인
- 커밋 메시지에도 `#<issue-number>` 참조 권장

### Branch Strategy
- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 통합 브랜치 (있는 경우)
- 기능 브랜치는 `main` 또는 `develop`에서 분기
- PR을 통해 머지, 직접 push 금지

## GitHub Labels

Issue 및 PR 생성 시 적절한 라벨 조합 사용:

### Type (필수)
| 라벨 | 설명 |
|------|------|
| `type:feat` | 새로운 기능 |
| `type:fix` | 버그 수정 |
| `type:docs` | 문서 변경 |
| `type:refactor` | 코드 리팩토링 |
| `type:test` | 테스트 추가/수정 |
| `type:chore` | 빌드/설정 변경 |

### Scope (필수)
| 라벨 | 설명 |
|------|------|
| `scope:frontend` | 프론트엔드 관련 |
| `scope:backend` | 백엔드 관련 |
| `scope:shared` | 공유 모듈 관련 |
| `scope:infra` | 인프라/DevOps 관련 |

### Priority (선택)
| 라벨 | 설명 |
|------|------|
| `priority:high` | 높은 우선순위 |
| `priority:medium` | 중간 우선순위 |
| `priority:low` | 낮은 우선순위 |

### Status (선택)
| 라벨 | 설명 |
|------|------|
| `status:blocked` | 차단됨/대기 중 |
| `status:in-progress` | 진행 중 |
| `status:review` | 리뷰 대기 |

### 특수 라벨
| 라벨 | 설명 |
|------|------|
| `devops` | DevOps 프로젝트 |
| `ci/cd` | CI/CD 파이프라인 |
| `dependencies` | 의존성 업데이트 |

## Documentation

- 문서는 코드와 함께 업데이트
- 복잡한 로직/알고리즘은 주석으로 설명
- 설계 문서: [docs/design/](docs/design/)
- DevOps 문서: [docs/DevOps/](docs/DevOps/)
