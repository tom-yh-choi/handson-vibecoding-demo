# 개발 워크플로우

프로젝트의 전체 개발 프로세스와 작업 흐름을 정의합니다.

---

## 1. 전체 워크플로우 개요

```mermaid
flowchart TD
    subgraph Phase1["1️⃣ 이슈 생성"]
        A[요구사항/버그 식별] --> B[GitHub Issue 생성]
        B --> C[라벨 할당]
        C --> D[담당자 지정]
    end

    subgraph Phase2["2️⃣ 작업 브랜치 생성"]
        D --> E[main 브랜치 최신화]
        E --> F["브랜치 생성<br/>feat/issue번호-설명"]
    end

    subgraph Phase3["3️⃣ 조사/구현/문서화"]
        F --> G[요구사항 분석]
        G --> H{조사 필요?}
        H -->|Yes| I[기술 조사]
        I --> J[설계 문서 작성]
        H -->|No| K[TDD 개발]
        J --> K
        K --> L[코드 구현]
        L --> M[테스트 작성]
        M --> N[문서화]
        N --> O[로컬 검증]
        O --> P{Pre-commit 통과?}
        P -->|No| L
        P -->|Yes| Q[커밋]
    end

    subgraph Phase4["4️⃣ PR 생성"]
        Q --> R[git push]
        R --> S[PR 생성]
        S --> T[PR 템플릿 작성]
        T --> U[리뷰어 지정]
    end

    subgraph Phase5["5️⃣ 리뷰"]
        U --> V[코드 리뷰]
        V --> W{승인?}
        W -->|No| X[피드백 반영]
        X --> L
        W -->|Yes| Y[Approve]
    end

    subgraph Phase6["6️⃣ CI/CD 검증"]
        S --> Z[CI 파이프라인 실행]
        Z --> AA[Lint/Build/Test]
        AA --> AB[E2E 테스트]
        AB --> AC{모든 체크 통과?}
        AC -->|No| L
        AC -->|Yes| AD[머지 가능]
        Y --> AE{CI 통과?}
        AD --> AE
        AE -->|Yes| AF[머지]
        AF --> AG{frontend 변경?}
        AG -->|Yes| AH[GitHub Pages 배포]
        AG -->|No| AI[완료]
        AH --> AI
    end
```

---

## 2. Phase 1: 이슈 생성

### 2.1 이슈 생성 프로세스

```mermaid
flowchart LR
    subgraph Identify["작업 식별"]
        A[새 기능 요청] --> D[Issue 생성]
        B[버그 발견] --> D
        C[개선 사항] --> D
    end

    subgraph Create["Issue 작성"]
        D --> E[템플릿 선택]
        E --> F[제목/내용 작성]
        F --> G[라벨 할당]
        G --> H[담당자 지정]
        H --> I[Issue 등록]
    end
```

### 2.2 라벨 체계

| 카테고리 | 라벨 | 설명 | 색상 |
|---------|------|------|------|
| **Type** | `type:feat` | 새로운 기능 | 🟢 |
| | `type:fix` | 버그 수정 | 🔴 |
| | `type:docs` | 문서 변경 | 🔵 |
| | `type:refactor` | 리팩토링 | 🟡 |
| | `type:test` | 테스트 | 🟣 |
| | `type:chore` | 빌드/설정 | ⚫ |
| **Scope** | `scope:frontend` | 프론트엔드 | 🎨 |
| | `scope:backend` | 백엔드 | ⚙️ |
| | `scope:shared` | 공유 모듈 | 📦 |
| | `scope:infra` | 인프라/DevOps | 🔧 |
| **Priority** | `priority:high` | 높음 | 🔴 |
| | `priority:medium` | 중간 | 🟡 |
| | `priority:low` | 낮음 | 🟢 |

### 2.3 Issue 상태 흐름

```mermaid
stateDiagram-v2
    [*] --> Open: Issue 생성
    Open --> InProgress: 작업 시작
    InProgress --> Review: PR 생성
    Review --> InProgress: 피드백 반영
    Review --> Closed: 머지 완료
    Open --> Closed: 중복/무효
    Closed --> [*]
```

---

## 3. Phase 2: 작업 브랜치 생성

### 3.1 브랜치 생성 흐름

```mermaid
flowchart TD
    A[Issue 확인] --> B["git checkout main"]
    B --> C["git pull origin main"]
    C --> D["git checkout -b type/issue번호-설명"]
    D --> E[작업 시작]

    subgraph Naming["브랜치 명명 규칙"]
        F["feat/123-user-auth"]
        G["fix/456-login-error"]
        H["docs/789-api-guide"]
        I["refactor/101-cleanup"]
    end
```

### 3.2 브랜치 전략

```mermaid
gitGraph
    commit id: "init"
    branch feat/123-new-feature
    checkout feat/123-new-feature
    commit id: "feat: 기능 구현"
    commit id: "test: 테스트 추가"
    commit id: "docs: 문서 업데이트"
    checkout main
    merge feat/123-new-feature id: "Merge PR #1" tag: "v1.0.1"
    branch fix/456-bugfix
    checkout fix/456-bugfix
    commit id: "fix: 버그 수정"
    checkout main
    merge fix/456-bugfix id: "Merge PR #2"
```

### 3.3 브랜치 명명 규칙

```
<type>/<issue-number>-<설명>
```

| 타입 | 예시 | 용도 |
|------|------|------|
| `feat` | `feat/123-user-auth` | 새 기능 개발 |
| `fix` | `fix/456-login-error` | 버그 수정 |
| `refactor` | `refactor/789-todo-context` | 리팩토링 |
| `docs` | `docs/101-api-guide` | 문서 작업 |
| `chore` | `chore/102-ci-setup` | 빌드/설정 |
| `hotfix` | `hotfix/999-critical` | 긴급 수정 |

---

## 4. Phase 3: 조사/구현/문서화

### 4.1 개발 사이클

```mermaid
flowchart TD
    subgraph Research["🔍 조사"]
        A[요구사항 분석] --> B{기술 조사 필요?}
        B -->|Yes| C[관련 문서 조사]
        C --> D[POC 작성]
        D --> E[설계 문서 작성]
        B -->|No| F[구현 시작]
        E --> F
    end

    subgraph Implementation["💻 구현"]
        F --> G["1️⃣ 테스트 작성 (Red)"]
        G --> H["2️⃣ 코드 구현"]
        H --> I["3️⃣ 테스트 실행"]
        I --> J{통과?}
        J -->|No 🔴| H
        J -->|Yes 🟢| K["4️⃣ 리팩토링"]
        K --> L{더 구현?}
        L -->|Yes| G
        L -->|No| M[구현 완료]
    end

    subgraph Documentation["📝 문서화"]
        M --> N[코드 주석]
        N --> O[README 업데이트]
        O --> P[설계 문서 업데이트]
        P --> Q[CHANGELOG 작성]
    end

    subgraph Commit["💾 커밋"]
        Q --> R[git add]
        R --> S[git commit]
        S --> T{Pre-commit Hook}
        T -->|Fail 🔴| H
        T -->|Pass 🟢| U[커밋 완료]
    end
```

### 4.2 Pre-commit Hook 동작

```mermaid
flowchart TD
    A["git commit 실행"] --> B["Pre-commit Hook 시작"]

    B --> C{"frontend/src/**/*.{js,ts,tsx}<br/>변경됨?"}
    C -->|Yes| D["Frontend 검증"]
    C -->|No| E{"backend/{src,lib,bin}/**/*.ts<br/>변경됨?"}

    subgraph FrontendCheck["🎨 Frontend 검증"]
        D --> D1["npm run frontend:lint --fix"]
        D1 --> D2{통과?}
        D2 -->|No| FAIL1["❌ 커밋 중단"]
        D2 -->|Yes| D3["npm run frontend:build"]
        D3 --> D4{통과?}
        D4 -->|No| FAIL1
        D4 -->|Yes| D5["npm run frontend:test"]
        D5 --> D6{통과?}
        D6 -->|No| FAIL1
        D6 -->|Yes| E
    end

    E -->|Yes| F["Backend 검증"]
    E -->|No| G["✅ 커밋 성공"]

    subgraph BackendCheck["⚙️ Backend 검증"]
        F --> F1["npm run backend:lint --fix"]
        F1 --> F2{통과?}
        F2 -->|No| FAIL2["❌ 커밋 중단"]
        F2 -->|Yes| F3["npm run backend:build"]
        F3 --> F4{통과?}
        F4 -->|No| FAIL2
        F4 -->|Yes| F5["npm run backend:test"]
        F5 --> F6{통과?}
        F6 -->|No| FAIL2
        F6 -->|Yes| G
    end
```

### 4.3 커밋 메시지 컨벤션

```mermaid
flowchart LR
    subgraph Format["커밋 형식"]
        A["type: description #issue"]
    end

    subgraph Types["타입"]
        B["feat"] --> B1["새 기능"]
        C["fix"] --> C1["버그 수정"]
        D["docs"] --> D1["문서"]
        E["refactor"] --> E1["리팩토링"]
        F["test"] --> F1["테스트"]
        G["chore"] --> G1["빌드/설정"]
    end
```

**예시:**
```bash
feat: Todo 필터링 기능 추가 #123

- 전체/완료/미완료 필터 구현
- 필터 상태 LocalStorage 저장
```

---

## 5. Phase 4: PR 생성

### 5.1 PR 생성 프로세스

```mermaid
flowchart TD
    A["git push origin feat/xxx"] --> B["GitHub에서 PR 생성"]
    B --> C["PR 템플릿 작성"]

    subgraph Template["PR 템플릿 내용"]
        C --> D["## Summary"]
        D --> E["변경 사항 요약"]
        E --> F["## Related Issue"]
        F --> G["Closes #123"]
        G --> H["## Changes"]
        H --> I["변경 목록"]
        I --> J["## Test"]
        J --> K["테스트 방법"]
    end

    K --> L["리뷰어 지정"]
    L --> M["라벨 할당"]
    M --> N["PR 생성 완료"]
```

### 5.2 PR 상태 흐름

```mermaid
stateDiagram-v2
    [*] --> Draft: PR 생성
    Draft --> Open: Ready for Review
    Open --> ChangesRequested: 리뷰 피드백
    ChangesRequested --> Open: 수정 완료
    Open --> Approved: 리뷰 승인
    Approved --> Merged: CI 통과 & 머지
    Open --> Closed: 닫힘
    Merged --> [*]
    Closed --> [*]
```

---

## 6. Phase 5: 코드 리뷰

### 6.1 리뷰 프로세스

```mermaid
flowchart TD
    subgraph Request["리뷰 요청"]
        A[PR 생성] --> B[리뷰어 알림]
        B --> C[리뷰 시작]
    end

    subgraph Review["리뷰 수행"]
        C --> D[코드 변경 확인]
        D --> E[로직 검토]
        E --> F[테스트 커버리지 확인]
        F --> G[컨벤션 준수 확인]
        G --> H{이슈 있음?}
    end

    subgraph Feedback["피드백"]
        H -->|Yes| I[코멘트 작성]
        I --> J[Changes Requested]
        J --> K[작성자 수정]
        K --> C
        H -->|No| L[Approve]
    end

    subgraph Merge["머지"]
        L --> M{CI 통과?}
        M -->|Yes| N[Squash & Merge]
        M -->|No| O[CI 수정 대기]
        O --> K
        N --> P[브랜치 삭제]
        P --> Q[Issue 자동 종료]
    end
```

### 6.2 리뷰 체크리스트

- [ ] 코드가 요구사항을 충족하는가?
- [ ] 테스트가 충분한가?
- [ ] 코딩 컨벤션을 준수하는가?
- [ ] 성능 이슈는 없는가?
- [ ] 보안 취약점은 없는가?
- [ ] 문서가 업데이트되었는가?

---

## 7. Phase 6: CI/CD 검증

### 7.1 CI 파이프라인 전체 흐름

```mermaid
flowchart TD
    subgraph Trigger["🎯 트리거"]
        A[PR 생성/업데이트]
        B[main 브랜치 push]
    end

    A --> C[CI 워크플로우]
    B --> C
    B --> D[배포 워크플로우]

    subgraph CI["🔄 CI 파이프라인"]
        C --> E[setup Job]
        E --> F[frontend Job]
        E --> G[backend Job]
        F --> H[e2e Job]
        G --> H
        H --> I[ci-status Job]
    end

    subgraph Deploy["🚀 배포"]
        D --> J{frontend 변경?}
        J -->|Yes| K[GitHub Pages 배포]
        J -->|No| L[스킵]
    end

    I --> M{모든 체크 통과?}
    M -->|Yes| N[머지 가능 ✅]
    M -->|No| O[수정 필요 ❌]
```

### 7.2 CI Job 상세

```mermaid
flowchart LR
    subgraph Setup["setup"]
        A1[Checkout] --> A2[Node.js 설정]
        A2 --> A3[캐시 복원]
        A3 --> A4[npm ci]
        A4 --> A5[shared 빌드]
        A5 --> A6[Artifact 업로드]
    end

    subgraph Frontend["frontend"]
        B1[Artifact 다운로드] --> B2[Lint]
        B2 --> B3[Build]
        B3 --> B4[Test]
    end

    subgraph Backend["backend"]
        C1[Artifact 다운로드] --> C2[Lint]
        C2 --> C3[Build]
        C3 --> C4[Test]
        C4 --> C5[CDK Synth]
    end

    subgraph E2E["e2e"]
        D1[Playwright 설치] --> D2[E2E 테스트]
        D2 --> D3[Report 업로드]
    end

    subgraph Status["ci-status"]
        E1{모든 Job 성공?}
        E1 -->|Yes| E2[✅ Pass]
        E1 -->|No| E3[❌ Fail]
    end

    A6 --> B1
    A6 --> C1
    B4 --> D1
    C5 --> D1
    D3 --> E1
```

### 7.3 CI/CD 검증 체크포인트

```mermaid
flowchart TD
    subgraph QualityGates["품질 게이트"]
        A[코드 품질]
        B[빌드 성공]
        C[테스트 통과]
        D[E2E 통과]
    end

    A --> E{Lint 통과?}
    E -->|No| F[❌ 실패]
    E -->|Yes| G{Build 성공?}
    G -->|No| F
    G -->|Yes| H{Unit Test 통과?}
    H -->|No| F
    H -->|Yes| I{E2E Test 통과?}
    I -->|No| F
    I -->|Yes| J[✅ 모든 검증 통과]

    J --> K[머지 가능]
    K --> L[main 브랜치 머지]
    L --> M{배포 트리거}
    M --> N[GitHub Pages 배포]
```

---

## 8. 전체 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant Dev as 개발자
    participant GH as GitHub
    participant CI as CI/CD
    participant Pages as GitHub Pages

    Note over Dev,Pages: Phase 1: Issue 생성
    Dev->>GH: Issue 생성
    GH-->>Dev: Issue #123 생성됨

    Note over Dev,Pages: Phase 2: 브랜치 생성
    Dev->>Dev: git checkout -b feat/123-feature

    Note over Dev,Pages: Phase 3: 조사/구현/문서화
    Dev->>Dev: 기술 조사
    Dev->>Dev: TDD 개발
    Dev->>Dev: 문서화
    Dev->>Dev: git commit (Pre-commit Hook 실행)

    Note over Dev,Pages: Phase 4: PR 생성
    Dev->>GH: git push & PR 생성

    Note over Dev,Pages: Phase 5 & 6: 리뷰 & CI/CD
    GH->>CI: CI 워크플로우 트리거
    CI->>CI: Lint/Build/Test
    CI->>CI: E2E 테스트
    CI-->>GH: 검증 결과 보고

    GH->>Dev: 리뷰 요청
    Dev->>GH: 피드백 반영 (필요시)
    GH-->>Dev: Approve

    Dev->>GH: Merge
    GH->>CI: 배포 트리거
    CI->>Pages: Frontend 배포
    Pages-->>Dev: 배포 완료
```

---

## 9. 일일 개발 루틴

### 시작

```bash
# 1. Issue 확인
gh issue view 123

# 2. main 브랜치 최신화
git checkout main
git pull origin main

# 3. 작업 브랜치 생성
git checkout -b feat/123-feature-name

# 4. shared 빌드 (의존성 변경 시)
npm run shared:build
```

### 개발 중

```bash
# 개발 서버 실행
npm run frontend:dev

# 테스트 실행
npm run frontend:test
npm run backend:test

# 타입 체크
npm run frontend:build
npm run backend:build
```

### 커밋 & PR

```bash
# 커밋 (pre-commit hook 자동 실행)
git add .
git commit -m "feat: 기능 설명 #123"

# 푸시
git push origin feat/123-feature-name

# PR 생성
gh pr create --title "feat: 기능 설명" --body "Closes #123"
```

### 리뷰 후

```bash
# 피드백 반영 후 재푸시
git add .
git commit -m "fix: 리뷰 피드백 반영"
git push origin feat/123-feature-name

# 머지 후 로컬 정리
git checkout main
git pull origin main
git branch -d feat/123-feature-name
```

---

## 참고

- [CI/CD 설계](ci-cd.md) - GitHub Actions 워크플로우 상세
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 규칙 및 컨벤션
