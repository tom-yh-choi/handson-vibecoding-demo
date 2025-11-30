# @vibecoding-demo/shared

프론트엔드와 백엔드에서 공통으로 사용하는 타입, 상수, 유틸리티 모듈입니다.

## 설치

모노레포 루트에서 npm workspaces를 통해 자동으로 링크됩니다.

```bash
# 루트에서
npm install
npm run shared:build
```

## 구조

```
src/
├── types/          # TypeScript 타입 정의
│   └── todo.ts     # Todo 관련 타입
├── constants/      # 공통 상수
│   └── todo.ts     # Todo 관련 상수
├── utils/          # 유틸리티 함수
│   └── todoUtils.ts
└── index.ts        # 메인 export
```

## 사용법

### 타입 import

```typescript
import { Todo, TodoFilter, TodoSortOption } from '@vibecoding-demo/shared/src/types/todo';
```

### 상수 import

```typescript
import { TODO_CONSTANTS } from '@vibecoding-demo/shared/src/constants/todo';
```

### 유틸리티 import

```typescript
import { filterTodos, sortTodos } from '@vibecoding-demo/shared/src/utils/todoUtils';
```

## 스크립트

```bash
npm run build    # TypeScript 컴파일
npm run test     # Jest 테스트 실행
npm run lint     # ESLint 실행
npm run lint:fix # ESLint 자동 수정
```

## 주요 타입

- `Todo`: TODO 아이템 인터페이스
- `TodoFilter`: 필터 옵션 (all, active, completed)
- `TodoSortOption`: 정렬 옵션 (newest, oldest, alphabetical)
