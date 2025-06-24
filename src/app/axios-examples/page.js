'use client';

import { useState } from 'react';
import axios from 'axios';
import { exampleApi } from '../../lib/api';

export default function AxiosExamples() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // 외부 API 호출 예제
  const fetchExternalPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await exampleApi.getPosts();
      setPosts(response.data.slice(0, 5)); // 처음 5개만 표시
      setResponse({
        status: response.status,
        headers: Object.keys(response.headers).length,
        dataLength: response.data.length
      });
    } catch (err) {
      setError('외부 API 호출에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 동시 요청 예제
  const fetchMultipleRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Promise.all을 사용한 동시 요청
      const [usersResponse, postsResponse, albumsResponse] = await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/users'),
        axios.get('https://jsonplaceholder.typicode.com/posts'),
        axios.get('https://jsonplaceholder.typicode.com/albums')
      ]);

      setResponse({
        users: usersResponse.data.length,
        posts: postsResponse.data.length,
        albums: albumsResponse.data.length,
        message: '세 개의 API를 동시에 호출했습니다!'
      });

    } catch (err) {
      setError('동시 요청에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 에러 처리 예제
  const testErrorHandling = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 존재하지 않는 엔드포인트 호출
      await axios.get('https://jsonplaceholder.typicode.com/nonexistent');
      
    } catch (err) {
      if (err.response) {
        // 서버에서 응답을 받았지만 에러 상태 코드
        setError(`서버 에러: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        // 요청은 했지만 응답을 받지 못함
        setError('네트워크 에러: 응답을 받지 못했습니다.');
      } else {
        // 요청 설정 중 에러 발생
        setError(`요청 에러: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 타임아웃 테스트
  const testTimeout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1초 타임아웃 설정
      const response = await axios.get('https://httpbin.org/delay/3', {
        timeout: 1000
      });
      
      setResponse({ message: '타임아웃 테스트 성공!' });
      
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('요청 타임아웃! (1초 내에 응답하지 않음)');
      } else {
        setError(`에러: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Axios 고급 사용 예제</h1>
        <p className="text-gray-600">다양한 HTTP 요청 패턴과 에러 처리 방법을 체험해보세요</p>
      </div>
      
      {/* 버튼들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={fetchExternalPosts}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transform transition-all duration-300 hover:scale-105 shadow-lg"
        >
          🌐 외부 API 호출
        </button>
        
        <button
          onClick={fetchMultipleRequests}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transform transition-all duration-300 hover:scale-105 shadow-lg"
        >
          ⚡ 동시 요청
        </button>
        
        <button
          onClick={testErrorHandling}
          disabled={loading}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 transform transition-all duration-300 hover:scale-105 shadow-lg"
        >
          ❌ 에러 처리 테스트
        </button>
        
        <button
          onClick={testTimeout}
          disabled={loading}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transform transition-all duration-300 hover:scale-105 shadow-lg"
        >
          ⏱️ 타임아웃 테스트
        </button>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="card p-8 text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">요청 처리 중...</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div className="alert alert-error mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <strong>에러 발생!</strong>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 응답 정보 */}
      {response && (
        <div className="alert alert-success mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">✅</span>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">응답 성공!</h3>
              <div className="bg-white bg-opacity-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 외부 API 데이터 표시 */}
      {posts.length > 0 && (
        <div className="card p-6 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">📝</span>
            <h3 className="text-2xl font-semibold">JSONPlaceholder 게시글 (상위 5개)</h3>
          </div>
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className="card p-4 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mr-2">
                        #{post.id}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
                        사용자 {post.userId}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg mb-3 text-gray-800 leading-tight">{post.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{post.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Axios 설정 정보 */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-2">⚙️</span>
            Axios 고급 기능들
          </h3>
          <div className="grid gap-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold mb-2 text-purple-700">🔄 인터셉터 (Interceptors)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 요청 전/후 처리</li>
                <li>• 인증 토큰 자동 추가</li>
                <li>• 에러 공통 처리</li>
                <li>• 로깅 및 디버깅</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-2 text-green-700">🛠️ 설정 옵션</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• timeout: 요청 타임아웃</li>
                <li>• headers: 커스텀 헤더</li>
                <li>• baseURL: 기본 URL 설정</li>
                <li>• withCredentials: 쿠키 포함</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-2">🚀</span>
            성능 & 에러 처리
          </h3>
          <div className="grid gap-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold mb-2 text-red-700">🔥 에러 처리</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• response: 서버 응답 에러</li>
                <li>• request: 네트워크 에러</li>
                <li>• 설정 에러</li>
                <li>• 재시도 로직 구현</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-2 text-blue-700">⚡ 성능 최적화</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 동시 요청 (Promise.all)</li>
                <li>• 요청 취소 (CancelToken)</li>
                <li>• 캐싱 전략</li>
                <li>• 압축 설정</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-100">
        <div className="text-center">
          <span className="text-4xl mb-4 block">💡</span>
          <h4 className="text-xl font-semibold mb-3 text-indigo-800">Pro Tips</h4>
          <p className="text-gray-600 max-w-2xl mx-auto">
            각 버튼을 클릭하여 다양한 axios 패턴을 체험해보세요. 
            브라우저 개발자 도구의 네트워크 탭과 콘솔을 확인하면 
            더 자세한 정보를 볼 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
