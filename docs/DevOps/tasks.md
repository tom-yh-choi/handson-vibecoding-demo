# DevOps 프로젝트 - 세부 태스크 목록

> 📋 [PRD](./prd.md) 기반 세부 작업 목록

---

## MVP-1: PR Quality Gate ✅ 완료

> `.github/workflows/ci.yml`로 통합 CI 파이프라인 구현 완료

### 1.1 워크플로우 파일 생성
- [x] `.github/workflows/ci.yml` 파일 생성
- [x] 워크플로우 이름 설정 (`name: CI`)
- [x] 트리거 설정 (`on: push/pull_request`, `branches: [main]`)

### 1.2 기본 환경 설정
- [x] `actions/checkout@v4` 추가
- [x] `actions/setup-node@v4` 추가
- [x] Node.js 버전 설정 (22)
- [x] npm 캐시 설정 (`cache: 'npm'`)

### 1.3 루트 의존성 설치
- [x] `npm ci` 명령어 추가
- [x] HUSKY=0 환경 변수 설정 (husky 설치 스킵)

### 1.4 Shared 패키지 빌드
- [x] setup job에서 shared 빌드
- [x] artifact로 빌드 결과물 공유

### 1.5 Frontend 검증
- [x] frontend lint 실행 (`npm run frontend:lint`)
- [x] frontend 빌드 (`npm run frontend:build`)
- [x] frontend 테스트 (`npm run frontend:test`)

### 1.6 Backend 검증
- [x] backend lint 실행 (`npm run backend:lint`)
- [x] backend 빌드 (`npm run backend:build`)
- [x] backend 테스트 (`npm run backend:test`)
- [x] CDK synth 검증 (`npm run cdk:synth`)

### 1.7 워크플로우 최적화
- [x] 작업 병렬화 설정 (setup → frontend/backend 병렬 → e2e)
- [x] concurrency 설정으로 중복 실행 취소
- [x] 캐시 키에 `package-lock.json` 해시 사용
- [x] artifact로 shared 빌드 결과물 공유

### 1.8 E2E 테스트 통합
- [x] Playwright chromium 프로젝트 실행
- [x] 테스트 결과 artifact 업로드

### 1.9 CI 상태 체크
- [x] ci-status job으로 최종 상태 확인
- [x] Branch Protection용 상태 체크 제공

### 1.10 기존 워크플로우 개선
- [x] `playwright.yml` 캐싱 및 concurrency 추가
- [x] `deploy-frontend.yml` 캐싱 최적화

---

## MVP-2: GitHub 템플릿

### 2.1 PR 템플릿
- [ ] `.github/pull_request_template.md` 파일 생성
- [ ] 제목 가이드 추가
- [ ] 변경 사항 요약 섹션
- [ ] 변경 유형 체크박스 (feat/fix/refactor/docs/test/chore)
- [ ] 관련 이슈 링크 (`Closes #`)
- [ ] 테스트 완료 체크박스
- [ ] 스크린샷 섹션 (UI 변경 시)
- [ ] 리뷰어 참고 사항 섹션

### 2.2 Bug Report 템플릿
- [ ] `.github/ISSUE_TEMPLATE/bug_report.yml` 파일 생성
- [ ] 템플릿 이름 설정 (`name: 🐛 Bug Report`)
- [ ] 설명 추가 (`description`)
- [ ] 라벨 자동 할당 (`labels: [type:fix]`)
- [ ] 버그 설명 필드 (textarea, required)
- [ ] 재현 단계 필드 (textarea, required)
- [ ] 예상 동작 필드 (textarea)
- [ ] 실제 동작 필드 (textarea)
- [ ] 환경 정보 필드 (dropdown: OS, Browser)
- [ ] 스크린샷/로그 필드 (textarea)

### 2.3 Feature Request 템플릿
- [ ] `.github/ISSUE_TEMPLATE/feature_request.yml` 파일 생성
- [ ] 템플릿 이름 설정 (`name: ✨ Feature Request`)
- [ ] 라벨 자동 할당 (`labels: [type:feat]`)
- [ ] 기능 요약 필드 (input, required)
- [ ] 배경/동기 필드 (textarea)
- [ ] 제안 솔루션 필드 (textarea, required)
- [ ] 대안 검토 필드 (textarea)
- [ ] 수락 기준 필드 (textarea)

### 2.4 Task 템플릿
- [ ] `.github/ISSUE_TEMPLATE/task.yml` 파일 생성
- [ ] 템플릿 이름 설정 (`name: 📋 Task`)
- [ ] 라벨 자동 할당 (`labels: [type:chore]`)
- [ ] 작업 설명 필드 (textarea, required)
- [ ] 세부 태스크 필드 (textarea)
- [ ] 완료 기준 필드 (textarea)
- [ ] 관련 문서 필드 (input)

### 2.5 템플릿 설정
- [ ] `.github/ISSUE_TEMPLATE/config.yml` 파일 생성
- [ ] `blank_issues_enabled: false` 설정
- [ ] contact_links 설정 (선택)

---

## MVP-3: Dependabot

### 3.1 설정 파일 생성
- [ ] `.github/dependabot.yml` 파일 생성
- [ ] `version: 2` 설정

### 3.2 루트 npm 설정
- [ ] `package-ecosystem: "npm"` 설정
- [ ] `directory: "/"` 설정
- [ ] `schedule.interval: "weekly"` 설정
- [ ] `schedule.day: "monday"` 설정
- [ ] `open-pull-requests-limit: 5` 설정
- [ ] `labels: ["dependencies"]` 설정

### 3.3 Frontend 설정
- [ ] `package-ecosystem: "npm"` 설정
- [ ] `directory: "/frontend"` 설정
- [ ] `schedule.interval: "weekly"` 설정
- [ ] 그룹화 설정 (production, development)

### 3.4 Backend 설정
- [ ] `package-ecosystem: "npm"` 설정
- [ ] `directory: "/backend"` 설정
- [ ] `schedule.interval: "weekly"` 설정
- [ ] 그룹화 설정 (production, development)

### 3.5 Shared 설정
- [ ] `package-ecosystem: "npm"` 설정
- [ ] `directory: "/shared"` 설정
- [ ] `schedule.interval: "weekly"` 설정

### 3.6 GitHub Actions 설정
- [ ] `package-ecosystem: "github-actions"` 설정
- [ ] `directory: "/"` 설정
- [ ] `schedule.interval: "weekly"` 설정

### 3.7 커밋 메시지 설정
- [ ] `commit-message.prefix: "chore(deps):"` 설정

---

## MVP-4: 백엔드 CD

### 4.1 AWS OIDC Provider 생성
- [ ] AWS IAM 콘솔 접근
- [ ] Identity providers 메뉴 이동
- [ ] "Add provider" 클릭
- [ ] Provider type: "OpenID Connect" 선택
- [ ] Provider URL: `https://token.actions.githubusercontent.com` 입력
- [ ] "Get thumbprint" 클릭
- [ ] Audience: `sts.amazonaws.com` 입력
- [ ] "Add provider" 완료

### 4.2 IAM Role 생성
- [ ] IAM Roles 메뉴 이동
- [ ] "Create role" 클릭
- [ ] Trusted entity type: "Web identity" 선택
- [ ] Identity provider: GitHub OIDC 선택
- [ ] Audience: `sts.amazonaws.com` 선택
- [ ] GitHub organization 입력
- [ ] GitHub repository 입력
- [ ] Role 이름 설정 (예: `github-actions-deploy-role`)

### 4.3 IAM Role 권한 정책 생성
- [ ] 새 정책 생성 (또는 inline policy)
- [ ] CloudFormation 권한 추가 (`cloudformation:*`)
- [ ] Lambda 권한 추가 (`lambda:*`)
- [ ] API Gateway 권한 추가 (`apigateway:*`)
- [ ] DynamoDB 권한 추가 (`dynamodb:*`)
- [ ] Cognito 권한 추가 (`cognito-idp:*`)
- [ ] IAM PassRole 권한 추가 (`iam:PassRole`)
- [ ] IAM Role 관련 권한 추가 (`iam:CreateRole`, `iam:AttachRolePolicy`, etc.)
- [ ] S3 권한 추가 (`s3:*` - CDK 아티팩트용)
- [ ] CloudWatch Logs 권한 추가 (`logs:*`)
- [ ] SSM 권한 추가 (`ssm:GetParameter`)
- [ ] STS 권한 추가 (`sts:AssumeRole`)

### 4.4 Trust Relationship 설정
- [ ] Trust policy에 조건 추가
- [ ] `StringEquals` 조건: `token.actions.githubusercontent.com:aud`
- [ ] `StringLike` 조건: `token.actions.githubusercontent.com:sub`
- [ ] Repository 및 branch 조건 설정

### 4.5 CDK Bootstrap
- [ ] AWS CLI 또는 콘솔 접근
- [ ] `cdk bootstrap aws://ACCOUNT-ID/REGION` 실행
- [ ] Bootstrap 스택 생성 확인
- [ ] S3 버킷 생성 확인

### 4.6 GitHub Secrets 설정
- [ ] Repository Settings 접근
- [ ] Secrets and variables > Actions 메뉴 이동
- [ ] "New repository secret" 클릭
- [ ] `AWS_ROLE_ARN` secret 추가 (IAM Role ARN)
- [ ] `AWS_REGION` secret 추가 (예: `ap-northeast-2`)

### 4.7 배포 워크플로우 생성
- [ ] `.github/workflows/deploy-backend.yml` 파일 생성
- [ ] 워크플로우 이름 설정 (`name: Deploy Backend`)
- [ ] 트리거 설정 (`on: push`, `branches: [main]`)
- [ ] paths 필터 설정 (`paths: ['backend/**']`)
- [ ] `workflow_dispatch` 추가 (수동 실행)

### 4.8 워크플로우 권한 설정
- [ ] `permissions.id-token: write` 설정
- [ ] `permissions.contents: read` 설정

### 4.9 Checkout 및 Node 설정
- [ ] `actions/checkout@v4` 추가
- [ ] `actions/setup-node@v4` 추가
- [ ] Node.js 버전 설정 (22)
- [ ] npm 캐시 설정

### 4.10 AWS 인증 설정
- [ ] `aws-actions/configure-aws-credentials@v4` 추가
- [ ] `role-to-assume: ${{ secrets.AWS_ROLE_ARN }}` 설정
- [ ] `aws-region: ${{ secrets.AWS_REGION }}` 설정
- [ ] `role-session-name: github-actions-deploy` 설정

### 4.11 빌드 단계
- [ ] 루트 의존성 설치 (`npm ci`)
- [ ] shared 빌드 (`npm run shared:build`)
- [ ] backend 의존성 설치
- [ ] backend 빌드 (`npm run backend:build`)

### 4.12 배포 단계
- [ ] CDK diff 실행 (변경사항 확인)
- [ ] CDK deploy 실행
- [ ] `--require-approval never` 옵션 추가
- [ ] 스택 출력 캡처

### 4.13 배포 결과 출력
- [ ] API 엔드포인트 URL 출력
- [ ] 배포 상태 요약

### 4.14 에러 처리
- [ ] 배포 실패 시 종료 코드 확인
- [ ] 실패 시 알림 (선택)

---

## 추후 작업 (MVP 범위 외)

### 모니터링
- [ ] CloudWatch 대시보드 CDK 스택 생성
- [ ] Lambda Duration 위젯 추가
- [ ] Lambda Errors 위젯 추가
- [ ] Lambda Throttles 위젯 추가
- [ ] API Gateway Latency 위젯 추가
- [ ] API Gateway 4xx/5xx 위젯 추가
- [ ] DynamoDB RCU/WCU 위젯 추가

### CloudWatch Alarms
- [ ] Lambda 에러율 알람 생성
- [ ] API Gateway 5xx 알람 생성
- [ ] Lambda Duration 알람 생성
- [ ] SNS 토픽 생성
- [ ] Email 구독 추가

### 알림 체계
- [ ] Slack Webhook URL 생성
- [ ] 배포 성공 알림 추가
- [ ] 배포 실패 알림 추가
- [ ] 알람 발생 시 알림 추가

### 테스트 커버리지
- [ ] Jest 커버리지 리포트 설정
- [ ] 커버리지 임계값 설정 (80%)
- [ ] PR 코멘트로 커버리지 표시
- [ ] 커버리지 감소 시 경고

---

## 진행 상태 범례

| 상태 | 의미 |
|------|------|
| `[ ]` | 미시작 |
| `[~]` | 진행 중 |
| `[x]` | 완료 |
| `[-]` | 스킵 |
