# Axios 사용 예제 프로젝트

이 프로젝트는 Next.js에서 Axios를 사용하는 다양한 방법을 보여주는 예제입니다.

## 설치된 패키지

- **axios**: HTTP 클라이언트 라이브러리
- **json-server**: 가짜 REST API 서버
- **concurrently**: 여러 명령어 동시 실행

## 프로젝트 구조

```
src/
├── app/
│   ├── page.js                 # 메인 페이지 (기본 axios 사용)
│   ├── axios-examples/
│   │   └── page.js            # 고급 axios 사용 예제
│   └── layout.js              # 레이아웃 (네비게이션 포함)
├── lib/
│   └── api.js                 # axios 설정 및 API 함수들
└── hooks/
    └── useTopics.js           # Topics 관리를 위한 커스텀 훅
```

## 실행 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. JSON Server 실행 (별도 터미널)
```bash
npm run json-server
```

### 3. 둘 다 동시에 실행
```bash
npm run dev:all
```

## Axios 사용 예제

### 1. 기본 HTTP 요청

```javascript
import axios from 'axios';

// GET 요청
const response = await axios.get('http://localhost:3001/topics');

// POST 요청
const newTopic = await axios.post('http://localhost:3001/topics', {
  title: '새 주제',
  body: '내용'
});

// PUT 요청
const updatedTopic = await axios.put('http://localhost:3001/topics/1', {
  title: '수정된 주제',
  body: '수정된 내용'
});

// DELETE 요청
await axios.delete('http://localhost:3001/topics/1');
```

### 2. Axios 인스턴스 생성

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 3. 인터셉터 사용

```javascript
// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('요청 전송:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('응답 받음:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API 에러:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

### 4. 에러 처리

```javascript
try {
  const response = await axios.get('/api/data');
} catch (error) {
  if (error.response) {
    // 서버에서 응답을 받았지만 에러 상태 코드
    console.error('응답 에러:', error.response.status, error.response.data);
  } else if (error.request) {
    // 요청은 했지만 응답을 받지 못함
    console.error('네트워크 에러:', error.request);
  } else {
    // 요청 설정 중 에러 발생
    console.error('설정 에러:', error.message);
  }
}
```

### 5. 동시 요청

```javascript
const [users, posts, albums] = await Promise.all([
  axios.get('/users'),
  axios.get('/posts'),
  axios.get('/albums')
]);
```

### 6. 커스텀 훅 사용

```javascript
import { useTopics } from '../hooks/useTopics';

function MyComponent() {
  const { topics, loading, error, addTopic, deleteTopic } = useTopics();
  
  // 컴포넌트에서 사용...
}
```

## 페이지 구성

### 메인 페이지 (`/`)
- 기본적인 CRUD 작업
- 커스텀 훅 사용 예제
- 실시간 데이터 관리

### Axios 예제 페이지 (`/axios-examples`)
- 외부 API 호출
- 동시 요청 처리
- 에러 처리 예제
- 타임아웃 테스트

## API 엔드포인트

JSON Server가 제공하는 REST API:

- `GET /topics` - 모든 주제 조회
- `GET /topics/:id` - 특정 주제 조회
- `POST /topics` - 새 주제 생성
- `PUT /topics/:id` - 주제 전체 수정
- `PATCH /topics/:id` - 주제 부분 수정
- `DELETE /topics/:id` - 주제 삭제

## 개발 팁

1. **브라우저 개발자 도구**에서 Network 탭을 확인하여 HTTP 요청을 모니터링하세요.

2. **콘솔 로그**를 확인하여 axios 인터셉터의 로그를 볼 수 있습니다.

3. **에러 처리**를 적절히 구현하여 사용자 경험을 향상시키세요.

4. **로딩 상태**를 관리하여 사용자에게 피드백을 제공하세요.

5. **커스텀 훅**을 사용하여 API 로직을 재사용 가능하게 만드세요.

## 참고 자료

- [Axios 공식 문서](https://axios-http.com/)
- [JSON Server 문서](https://github.com/typicode/json-server)
- [Next.js 공식 문서](https://nextjs.org/docs)
