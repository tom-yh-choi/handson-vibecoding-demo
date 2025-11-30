# DevOps 강화 프로젝트 - Pre PRD

## 1. 프로젝트 개요

### 1.1 배경
현재 TODO 앱 모노레포는 기본적인 CI/CD 파이프라인(Playwright 테스트, GitHub Pages 배포)과 pre-commit 훅이 구성되어 있으나, DevOps 체계가 미흡한 상태입니다.

### 1.2 목표
DevOps 학습 및 실습을 위한 체계를 **MVP 방식**으로 빠르게 구축합니다.

### 1.3 제약 조건

> ⚠️ **중요: 비용 및 접근 방식**
> - **연습용 프로젝트**: 학습 및 실습 목적
> - **비용**: AWS 프리티어 한도 내에서 운영 (월 $0 목표)
> - **접근 방식**: MVP (Minimum Viable Product) - 빠른 구현 우선, 점진적 개선

### 1.4 범위 (MVP 기준)
- ✅ CI 파이프라인 강화 (GitHub Actions - 무료)
- ✅ 기본 CD 파이프라인 (GitHub Actions + AWS 프리티어)
- ⏸️ 모니터링 (CloudWatch 기본 - 프리티어 범위)
- ✅ 개발 생산성 도구 (GitHub 기본 기능 활용)

---

## 2. 현황 분석

### 2.1 현재 구성된 항목

| 영역 | 현황 | 상태 |
|------|------|------|
| **CI** | Playwright E2E 테스트 (main 브랜치) | ✅ 구성됨 |
| **CD** | GitHub Pages 프론트엔드 배포 | ✅ 구성됨 |
| **Pre-commit** | lint fix → build → test 자동 실행 | ✅ 구성됨 |
| **IaC** | AWS CDK 스택 정의 (설계 문서만 존재) | ⚠️ 미구현 |
| **Monitoring** | CloudWatch 설계 문서만 존재 | ⚠️ 미구현 |
| **Backend CI/CD** | 없음 | ❌ 없음 |

### 2.2 GitHub Actions 워크플로우 현황

```
.github/workflows/
├── playwright.yml        # E2E 테스트 (main push/PR)
└── deploy-frontend.yml   # 프론트엔드 배포 (main push)
```

### 2.3 개선 필요 영역 (MVP 관점)

1. **CI 파이프라인** - PR 품질 게이트 없음
2. **백엔드 CI/CD** - 전무
3. **개발 생산성** - PR/Issue 템플릿 없음

---

## 3. MVP 구현 계획

### 3.1 비용 분석

| 서비스 | 프리티어 한도 | 예상 사용량 | 비용 |
|--------|--------------|-------------|------|
| **GitHub Actions** | 2,000분/월 (무료) | ~500분/월 | $0 |
| **AWS Lambda** | 100만 요청/월 | ~1,000 요청/월 | $0 |
| **DynamoDB** | 25GB + 25 RCU/WCU | ~1GB | $0 |
| **API Gateway** | 100만 요청/월 | ~1,000 요청/월 | $0 |
| **CloudWatch** | 기본 메트릭 무료 | 기본만 사용 | $0 |
| **Cognito** | 50,000 MAU | ~10 MAU | $0 |
| **총 예상 비용** | - | - | **$0/월** |

### 3.2 MVP Phase 1: CI 강화 (1-2일)

> 🎯 **목표**: PR 품질 게이트 구축

#### 3.2.1 PR Quality Gate 워크플로우
```yaml
# .github/workflows/pr-check.yml
name: PR Check
on:
  pull_request:
    branches: [main]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint --workspaces
      - run: npm run build --workspaces
      - run: npm run test --workspaces
```

#### 3.2.2 구현 항목
- [ ] PR Quality Gate 워크플로우 생성
- [ ] Branch protection rule 설정 (require PR check)
- [ ] 기존 워크플로우 캐싱 최적화

### 3.3 MVP Phase 2: 개발 생산성 (반나절)

> 🎯 **목표**: GitHub 템플릿으로 협업 효율화

#### 3.3.1 구현 항목
- [ ] PR 템플릿 (`.github/pull_request_template.md`)
- [ ] Issue 템플릿 (Bug, Feature)
- [ ] Dependabot 설정 (주 1회 업데이트 체크)

### 3.4 MVP Phase 3: 백엔드 CD (1-2일)

> 🎯 **목표**: main 머지 시 자동 배포

#### 3.4.1 배포 워크플로우
```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: aws-actions/configure-aws-credentials@v4
      - run: cd backend && npm ci && npm run cdk deploy -- --require-approval never
```

#### 3.4.2 구현 항목
- [ ] AWS OIDC 연동 (GitHub Actions ↔ AWS)
- [ ] 백엔드 배포 워크플로우 생성
- [ ] GitHub Secrets 설정

### 3.5 Phase 4: 모니터링 (선택/추후)

> ⏸️ **MVP 범위 외** - 프리티어 내 기본 모니터링만

- CloudWatch 기본 메트릭 (Lambda, API Gateway 자동 수집)
- CloudWatch Logs (Lambda 자동 연동)
- 커스텀 대시보드/알람은 추후 필요시 추가

---

## 4. MVP 우선순위

| 순위 | 항목 | 예상 소요 | 비용 | 상태 |
|------|------|----------|------|------|
| **MVP-1** | PR Quality Gate | 2시간 | $0 | 🔴 미시작 |
| **MVP-2** | GitHub 템플릿 | 1시간 | $0 | 🔴 미시작 |
| **MVP-3** | Dependabot | 30분 | $0 | 🔴 미시작 |
| **MVP-4** | 백엔드 CD | 4시간 | $0 | 🔴 미시작 |
| **추후** | 모니터링 대시보드 | - | $0 | ⏸️ 보류 |
| **추후** | 알림 체계 | - | $0 | ⏸️ 보류 |

**총 예상 소요 시간: 1-2일**

---

## 5. 성공 기준 (MVP)

### 5.1 필수 달성
- [ ] PR 생성 시 자동 품질 검사 실행
- [ ] main 머지 후 백엔드 자동 배포
- [ ] PR/Issue 템플릿 적용
- [ ] **월 비용 $0 유지**

### 5.2 선택 달성
- [ ] 테스트 커버리지 리포트
- [ ] 배포 알림 (Slack/Discord)

---

## 6. 다음 단계

1. ~~Pre PRD 작성~~ ✅
2. **GitHub Issues 생성**: MVP 항목별 이슈 생성
3. **MVP-1 구현**: PR Quality Gate
4. **MVP-2 구현**: GitHub 템플릿
5. **MVP-3 구현**: Dependabot
6. **MVP-4 구현**: 백엔드 CD

---

## 7. 참고 문서

- [인프라 설계](../design/infrastructure.md)
- [모니터링 설계](../design/monitoring.md)
- [GitHub Actions 가격](https://docs.github.com/en/billing/managing-billing-for-github-actions)
- [AWS 프리티어](https://aws.amazon.com/free/)
