# docs

프로젝트의 요구사항, 설계, 체크리스트, DevOps 문서를 관리합니다.

## 문서 구조

### 요구사항

- [요구사항 문서](./requirements.md): 프로젝트의 기능적/비기능적 요구사항 정의

### 설계

- [아키텍처 설계](./design/architecture.md): 전체 시스템 아키텍처와 개발 단계 정의
- [프론트엔드 설계](./design/frontend.md): 프론트엔드 컴포넌트 구조와 상태 관리 방식
- [백엔드 설계](./design/backend.md): 백엔드 도메인 모델과 유스케이스 정의
- [인프라 설계](./design/infrastructure.md): AWS CDK 기반 인프라 구성
- [보안 설계](./design/security.md): 인증/인가 및 데이터 보안 방식
- [모니터링 설계](./design/monitoring.md): 로깅과 모니터링 전략
- [최적화 설계](./design/optimization.md): 비용 및 성능 최적화 방안
- [구현 계획](./design/implementation.md): 단계별 구현 계획

### 체크리스트

- [체크리스트 개요](./tasks/README.md): 전체 구현 체크리스트 관리
- [모노레포 설정](./tasks/01-monorepo-setup.md): 프로젝트 초기 설정
- [프론트엔드 코어](./tasks/02-frontend-core.md): 프론트엔드 핵심 기능 구현
- [프론트엔드 UI](./tasks/03-frontend-ui.md): UI 컴포넌트 구현
- [프론트엔드 통합](./tasks/04-frontend-integration.md): 라우팅 및 통합
- [프론트엔드 배포](./tasks/05-frontend-deployment.md): 프론트엔드 배포
- [백엔드 개발](./tasks/06-backend-development.md): 백엔드 개발
- [통합](./tasks/07-integration.md): 프론트엔드-백엔드 통합
- [인프라 및 배포](./tasks/08-infrastructure.md): 인프라 구성 및 배포

### DevOps

- [DevOps PRD](./DevOps/prd.md): DevOps 강화 프로젝트 PRD (MVP 방식)
- [DevOps 태스크](./DevOps/tasks.md): 세부 작업 목록
