import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://localhost:3001';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (요청 전 처리)
api.interceptors.request.use(
  (config) => {
    console.log('요청 전송:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (응답 후 처리)
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

// Topics API 함수들
export const topicsApi = {
  // 모든 주제 가져오기
  getAll: () => api.get('/topics'),
  
  // 특정 주제 가져오기
  getById: (id) => api.get(`/topics/${id}`),
  
  // 새 주제 생성
  create: (data) => api.post('/topics', data),
  
  // 주제 업데이트
  update: (id, data) => api.put(`/topics/${id}`, data),
  
  // 주제 삭제
  delete: (id) => api.delete(`/topics/${id}`),
  
  // 주제 부분 업데이트
  patch: (id, data) => api.patch(`/topics/${id}`, data),
};

// 다른 API 예제들
export const exampleApi = {
  // 외부 API 예제 - JSONPlaceholder
  getPosts: () => axios.get('https://jsonplaceholder.typicode.com/posts'),
  
  // 파일 업로드 예제
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 쿼리 파라미터 사용 예제
  searchTopics: (query) => api.get('/topics', {
    params: {
      q: query,
      _sort: 'title',
      _order: 'asc'
    }
  }),
};

export default api;
