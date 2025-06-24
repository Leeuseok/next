'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTopics } from "../hooks/useTopics";

export default function Home() {
  const { topics, loading, error, addTopic, deleteTopic } = useTopics();
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicBody, setNewTopicBody] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicBody.trim()) return;

    try {
      await addTopic({
        title: newTopicTitle,
        body: newTopicBody
      });
      setNewTopicTitle('');
      setNewTopicBody('');
      setShowSuccess(true);
      
      // 성공 메시지 3초 후 숨기기
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      // 에러는 이미 커스텀 훅에서 처리됨
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl fade-in">
      {/* 성공 토스트 알림 */}
      {showSuccess && (
        <div className="toast alert-success">
          <div className="flex items-center">
            <span className="text-xl mr-2">🎉</span>
            <span>주제가 성공적으로 추가되었습니다!</span>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 typing-effect">Axios 사용 예제</h2>
        <p className="text-lg mb-6 text-gray-600">실시간 데이터 관리를 체험해보세요</p>
        <div className="flex justify-center items-center space-x-4 mb-6">
          <img src="/next.svg" width="60" alt="Next.js" className="animate-pulse" />
          <span className="text-2xl">+</span>
          <div className="flex items-center bg-white bg-opacity-80 px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-gray-700">Axios</span>
          </div>
        </div>
      </div>
      
      <div className="window mb-8">
        <div className="window-controls">
          <div className="window-control red"></div>
          <div className="window-control yellow"></div>
          <div className="window-control green"></div>
        </div>
        <div className="pt-8 p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            새 주제 추가
          </h3>
          <form onSubmit={handleAddTopic} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                📝 제목
              </label>
              <input
                type="text"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                className="w-full glitter-effect"
                placeholder="주제 제목을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                📄 내용
              </label>
              <textarea
                value={newTopicBody}
                onChange={(e) => setNewTopicBody(e.target.value)}
                className="w-full glitter-effect"
                rows="4"
                placeholder="주제 내용을 입력하세요"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {newTopicTitle.length}/50 글자 • {newTopicBody.length}/200 글자
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 glitter-effect"
                disabled={loading || !newTopicTitle.trim() || !newTopicBody.trim()}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    추가 중...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="mr-2">🚀</span>
                    주제 추가
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="window">
        <div className="window-controls">
          <div className="window-control red"></div>
          <div className="window-control yellow"></div>
          <div className="window-control green"></div>
        </div>
        <div className="pt-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center">
              <span className="text-2xl mr-2">📚</span>
              Topics 목록
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">총 {topics.length}개</span>
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>}
            </div>
          </div>
        
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-20 rounded-lg"></div>
              ))}
            </div>
          )}
        
          {error && (
            <div className="alert alert-error shake">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <strong>오류 발생!</strong>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        
          {!loading && topics.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">아직 주제가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">위의 양식을 사용해서 첫 번째 주제를 추가해보세요!</p>
            </div>
          )}
        
          <div className="grid gap-4">
            {topics.map((topic, index) => (
              <div 
                key={topic.id} 
                className="card p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-gradient-to-b from-blue-500 to-purple-600"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'floatUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mr-2">
                        #{topic.id}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-xl mb-3 text-gray-800 leading-tight">
                      {topic.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {topic.body}
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="mr-4">글자 수: {topic.body.length}</span>
                      <span>ID: {topic.id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link
                      href={`/update/${topic.id}`}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 glitter-effect text-center"
                      title="주제 수정"
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-1">✏️</span>
                        수정
                      </span>
                    </Link>
                    <button 
                      onClick={() => deleteTopic(topic.id)}
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-red-700 transition-all duration-300 transform hover:scale-105 glitter-effect"
                      title="주제 삭제"
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-1">🗑️</span>
                        삭제
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-100">
        <h4 className="font-bold mb-4 text-blue-800 flex items-center text-lg">
          <span className="text-2xl mr-2">💡</span>
          Axios 사용법 안내
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-700 mb-2 flex items-center">
                <span className="mr-2">🚀</span>
                서버 실행
              </h5>
              <code className="block w-full">
                npx json-server --watch db.json --port 3001
              </code>
            </div>
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-700 mb-2 flex items-center">
                <span className="mr-2">🔍</span>
                개발자 도구
              </h5>
              <p className="text-sm text-gray-600">브라우저 콘솔에서 API 요청/응답 로그 확인</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-700 mb-2 flex items-center">
                <span className="mr-2">📁</span>
                API 설정
              </h5>
              <p className="text-sm text-gray-600">/src/lib/api.js 파일에서 axios 설정 확인</p>
            </div>
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-700 mb-2 flex items-center">
                <span className="mr-2">🎣</span>
                커스텀 훅
              </h5>
              <p className="text-sm text-gray-600">/src/hooks/useTopics.js 파일에서 훅 확인</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white bg-opacity-70 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">API 서버 상태</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-green-600 font-medium">연결됨</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
