# Vibecoding TODO App Monorepo

[![CI](https://github.com/tom-yh-choi/handson-vibecoding-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/tom-yh-choi/handson-vibecoding-demo/actions/workflows/ci.yml)
[![E2E Tests](https://github.com/tom-yh-choi/handson-vibecoding-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/tom-yh-choi/handson-vibecoding-demo/actions/workflows/playwright.yml)
[![Deploy Frontend](https://github.com/tom-yh-choi/handson-vibecoding-demo/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/tom-yh-choi/handson-vibecoding-demo/actions/workflows/deploy-frontend.yml)

모던 웹 개발 및 DevOps 베스트 프랙티스를 반영한 TODO 앱 모노레포입니다.

## 주요 특징

- **모노레포 구조**: npm workspaces 기반 프론트엔드, 백엔드, 공유 모듈 통합 관리
- **프론트엔드**: React 19 + Mantine v7 + TypeScript + Vite
- **백엔드**: Node.js + TypeScript + Clean Architecture + AWS CDK
- **공유 모듈**: 타입, 상수, 유틸리티 패키지 (`@vibecoding-demo/shared`)
- **CI/CD**: GitHub Actions 기반 자동화 파이프라인
- **E2E 테스트**: Playwright 기반 크로스 브라우저 테스트
- **자동화**: Pre-commit 훅으로 lint, build, test 자동 실행

## 디렉토리 구조

```
root/
├── frontend/          # React + Mantine + Vite
├── backend/           # Node.js + TypeScript + AWS CDK
├── shared/            # 공유 타입, 상수, 유틸리티
├── docs/              # 프로젝트 문서
│   ├── design/        # 설계 문서
│   ├── tasks/         # 구현 체크리스트
│   └── DevOps/        # DevOps PRD 및 태스크
├── scripts/           # 유틸리티 스크립트
└── .github/workflows/ # CI/CD 워크플로우
```

## 빠른 시작

### 요구 사항

- Node.js >= 22.0.0
- npm >= 10.0.0

### 설치

```bash
npm install
npm run shared:build
```

### 개발 서버 실행

```bash
npm run frontend:dev
```

### 빌드 및 테스트

```bash
# 전체 빌드
npm run shared:build
npm run frontend:build
npm run backend:build

# 테스트
npm run frontend:test
npm run backend:test

# E2E 테스트
npm run test:e2e
```

## CI/CD 파이프라인

### GitHub Actions 워크플로우

| 워크플로우 | 트리거 | 설명 |
|-----------|--------|------|
| `ci.yml` | push/PR to main | 린트, 빌드, 테스트, CDK synth |
| `playwright.yml` | push/PR to main | E2E 테스트 실행 |
| `deploy-frontend.yml` | push to main | GitHub Pages 배포 |

### 파이프라인 구조

```
setup → frontend (lint/build/test)
      → backend (lint/build/test/cdk synth)
      → e2e (Playwright)
      → ci-status (상태 확인)
```

## 개발 규칙

- **TDD**: 비즈니스 로직은 테스트 먼저 작성
- **Clean Architecture**: 백엔드는 계층 분리 원칙 적용
- **SOLID 원칙**: 코드 품질 유지
- **커뮤니케이션**: 한국어 사용
- **Pre-commit**: `frontend/src/**/*.{js,ts,tsx}`, `backend/{src,lib,bin}/**/*.ts` 변경 시 자동 검증

## 문서

- [요구사항](docs/requirements.md)
- [아키텍처 설계](docs/design/architecture.md)
- [프론트엔드 설계](docs/design/frontend.md)
- [백엔드 설계](docs/design/backend.md)
- [구현 체크리스트](docs/tasks/README.md)
- [DevOps PRD](docs/DevOps/prd.md)

## 라이선스

MIT
