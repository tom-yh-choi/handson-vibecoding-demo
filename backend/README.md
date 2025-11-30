# backend

Node.js + TypeScript 기반의 TODO 앱 백엔드 프로젝트입니다. Clean Architecture 패턴과 AWS CDK를 사용합니다.

## 아키텍처

### Clean Architecture 구조

```
src/
├── domain/           # 도메인 계층 (엔티티, 인터페이스)
│   ├── todo/         # Todo 엔티티, 레포지토리 인터페이스
│   └── user/         # User 엔티티, 인증 인터페이스
├── application/      # 애플리케이션 계층 (유스케이스)
├── infrastructure/   # 인프라 계층 (외부 서비스 어댑터)
│   ├── dynamodb/     # DynamoDB 레포지토리 구현
│   └── cognito/      # Cognito 인증 구현
├── interfaces/rest/  # 인터페이스 계층 (REST 컨트롤러)
├── main/             # 애플리케이션 엔트리 포인트
└── lambda/           # Lambda 함수 핸들러
```

### CDK 스택 구조

```
lib/
├── api/       # API Gateway 스택
├── auth/      # Cognito 스택
├── database/  # DynamoDB 스택
└── lambda/    # Lambda 함수 스택
```

## 의존성 방향

```
Domain ← Application ← Infrastructure/Interfaces
```

내부 계층(Domain)은 외부 계층에 의존하지 않습니다.

## 스크립트

```bash
# 빌드
npm run build        # TypeScript 컴파일
npm run clean        # 빌드 결과물 삭제

# 테스트
npm run test         # Jest 테스트 실행
npm run test:watch   # 테스트 감시 모드
npm run test:coverage # 커버리지 리포트 생성

# 린트/포맷
npm run lint         # ESLint 실행
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅

# CDK
npm run cdk:synth    # CloudFormation 템플릿 생성
npm run cdk:deploy   # AWS 배포
npm run cdk:destroy  # AWS 리소스 삭제
```

## 기술 스택

- **런타임**: Node.js 22+
- **언어**: TypeScript
- **테스트**: Jest
- **IaC**: AWS CDK
- **AWS 서비스**: Lambda, API Gateway, DynamoDB, Cognito

## 개발 규칙

- TDD 기반 개발 (테스트 먼저 작성)
- SOLID 원칙 준수
- 의존성 주입을 통한 느슨한 결합
- 테스트 커버리지 80% 이상 유지
