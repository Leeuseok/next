'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useReduxTopics } from "../hooks/useReduxTopics";
import { useReduxDateTime } from "../hooks/useReduxDateTime";
import { formatRelativeTime, formatKoreanDate, getCurrentKoreanTime } from "../lib/moment-utils";

export default function Home() {
  const { topics, loading, error, statistics, addTopic, removeTopic } = useReduxTopics();
  const { formattedCurrentTime, todayHolidays } = useReduxDateTime();
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicBody, setNewTopicBody] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicBody.trim()) return;

    try {
      await addTopic({
        title: newTopicTitle,
        body: newTopicBody,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).unwrap(); // unwrap을 사용해서 rejected promise를 throw하도록 함
      
      setNewTopicTitle('');
      setNewTopicBody('');
      setShowSuccess(true);
      
      // 성공 메시지 3초 후 숨기기
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      // 에러는 이미 Redux에서 처리됨
      console.error('Failed to add topic:', err);
    }
  };

  const handleDeleteTopic = async (id) => {
    try {
      await removeTopic(id).unwrap();
    } catch (err) {
      console.error('Failed to delete topic:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* 배경 파티클 효과 */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto p-4 max-w-6xl relative z-10">
        {/* 성공 토스트 알림 */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 toast alert-success modern-card neon-glow animate-bounce">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎉</span>
              <span className="font-semibold">주제가 성공적으로 추가되었습니다!</span>
            </div>
          </div>
        )}

      {/* Redux 통계 및 실시간 정보 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="glass-card p-8 modern-card floating">
          <h3 className="text-2xl font-bold mb-6 flex items-center gradient-text">
            <span className="text-3xl mr-3 animate-pulse">📊</span>
            Redux 상태 통계
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl text-center modern-card bounce-scale">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                {statistics.total}
              </div>
              <div className="text-sm font-medium text-purple-700 mt-2">전체 주제</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl text-center modern-card bounce-scale">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                {statistics.createdToday}
              </div>
              <div className="text-sm font-medium text-green-700 mt-2">오늘 생성</div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center modern-card bounce-scale">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {statistics.updatedToday}
              </div>
              <div className="text-sm font-medium text-blue-700 mt-2">오늘 수정</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-200 p-6 rounded-2xl text-center modern-card bounce-scale">
              <div className="text-3xl font-bold">
                {loading ? (
                  <span className="animate-spin text-yellow-600">⏳</span>
                ) : (
                  <span className="text-green-600 animate-pulse">✅</span>
                )}
              </div>
              <div className="text-sm font-medium text-yellow-700 mt-2">상태</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 modern-card floating" style={{animationDelay: '0.5s'}}>
          <h3 className="text-2xl font-bold mb-6 flex items-center gradient-text">
            <span className="text-3xl mr-3 neon-glow text-teal-400">⏰</span>
            실시간 정보
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100 wave-effect">
              <div className="font-semibold text-teal-800 text-lg">현재 시간</div>
              <div className="text-teal-600 font-mono text-xl typing-cursor">{formattedCurrentTime}</div>
            </div>
            {todayHolidays.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100 modern-card">
                <div className="font-semibold text-red-800 text-lg flex items-center">
                  <span className="mr-2 animate-bounce">🎉</span>
                  오늘의 공휴일
                </div>
                {todayHolidays.map((holiday, index) => (
                  <div key={index} className="text-red-600 font-medium">{holiday.name}</div>
                ))}
              </div>
            )}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100 hologram">
              <div className="font-semibold text-gray-800 text-lg">Redux 연결</div>
              <div className="flex items-center text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse neon-glow"></span>
                <span className="font-medium">실시간 동기화</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold mb-6 gradient-text-rainbow floating">
            Modern Tech Stack
          </h2>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Next.js, Axios, Moment.js, Redux의 완벽한 조화로 만든 현대적 웹 애플리케이션
          </p>
          <div className="flex justify-center items-center space-x-6 mb-8 flex-wrap gap-4">
            <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30 modern-card">
              <img src="/next.svg" width="40" alt="Next.js" className="animate-pulse mr-3" />
              <span className="font-semibold text-gray-800">Next.js 15</span>
            </div>
            <span className="text-3xl animate-pulse">+</span>
            <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30 modern-card">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-gray-800">Axios</span>
            </div>
            <span className="text-3xl animate-pulse">+</span>
            <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30 modern-card">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-gray-800">Moment.js</span>
            </div>
            <span className="text-3xl animate-pulse">+</span>
            <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30 modern-card">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-gray-800">Redux</span>
            </div>
          </div>
          
          {/* 데모 페이지 링크 */}
          <div className="flex justify-center space-x-4 mb-6 flex-wrap gap-4">
            <Link
              href="/axios-examples"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 modern-card shadow-xl magnetic"
            >
              <span className="flex items-center font-semibold">
                <span className="mr-3 text-xl">🔗</span>
                Axios 고급 예제
              </span>
            </Link>
            <Link
              href="/moment-demo"
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 modern-card shadow-xl magnetic"
            >
              <span className="flex items-center font-semibold">
                <span className="mr-3 text-xl">⏰</span>
                Moment.js 데모
              </span>
            </Link>
            <Link
              href="/redux-demo"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 modern-card shadow-xl magnetic"
            >
              <span className="flex items-center font-semibold">
                <span className="mr-3 text-xl">🏪</span>
                Redux 데모
              </span>
            </Link>
          </div>
        </div>
      
      <div className="glass-card mb-12 modern-card spectrum-border">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl">
          <div className="p-8">
            <h3 className="text-3xl font-bold mb-6 flex items-center gradient-text">
              <span className="text-4xl mr-4 floating">✨</span>
              새 주제 추가
            </h3>
            <form onSubmit={handleAddTopic} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-800 flex items-center">
                    <span className="mr-2 text-xl">📝</span>
                    제목
                  </label>
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg backdrop-blur-sm bg-white bg-opacity-90 modern-card"
                    placeholder="✍️ 주제 제목을 입력하세요..."
                    required
                  />
                  <div className="text-right text-sm text-gray-500 mt-2">
                    <span className={newTopicTitle.length > 40 ? 'text-orange-500' : 'text-gray-500'}>
                      {newTopicTitle.length}/50 글자
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-800 flex items-center">
                    <span className="mr-2 text-xl">📄</span>
                    내용
                  </label>
                  <textarea
                    value={newTopicBody}
                    onChange={(e) => setNewTopicBody(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg backdrop-blur-sm bg-white bg-opacity-90 modern-card resize-none"
                    rows="6"
                    placeholder="📝 주제 내용을 상세히 입력하세요..."
                    required
                  />
                  <div className="text-right text-sm text-gray-500 mt-2">
                    <span className={newTopicBody.length > 180 ? 'text-orange-500' : 'text-gray-500'}>
                      {newTopicBody.length}/200 글자
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6">
                <div className="text-sm text-gray-600 flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  실시간 저장 준비
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-12 py-4 rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 modern-card shadow-2xl magnetic neon-glow font-bold text-lg"
                  disabled={loading || !newTopicTitle.trim() || !newTopicBody.trim()}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      추가 중...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-3 text-xl">🚀</span>
                      주제 추가하기
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mr-2">
                          #{topic.id}
                        </span>
                        {topic.createdAt && (
                          <span className="text-xs text-gray-400 font-mono">
                            {formatRelativeTime(topic.createdAt)}
                          </span>
                        )}
                      </div>
                      {topic.updatedAt && topic.updatedAt !== topic.createdAt && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          수정됨
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xl mb-3 text-gray-800 leading-tight">
                      {topic.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {topic.body}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 space-x-4">
                      <span>글자 수: {topic.body.length}</span>
                      <span>ID: {topic.id}</span>
                      {topic.createdAt && (
                        <span title={formatKoreanDate(topic.createdAt)}>
                          {formatRelativeTime(topic.createdAt)}
                        </span>
                      )}
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
                      onClick={() => handleDeleteTopic(topic.id)}
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
          Axios & Moment.js 사용법 안내
        </h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-700 mb-2 flex items-center">
                <span className="mr-2">🚀</span>
                서버 실행
              </h5>
              <code className="block w-full text-xs">
                npm run dev:json
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
          <div className="space-y-4">
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-700 mb-2 flex items-center">
                <span className="mr-2">⏰</span>
                Moment.js
              </h5>
              <p className="text-sm text-gray-600">/src/lib/moment-utils.js 파일에서 날짜 유틸리티 확인</p>
            </div>
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-700 mb-2 flex items-center">
                <span className="mr-2">📊</span>
                데모 페이지
              </h5>
              <p className="text-sm text-gray-600">위 버튼으로 고급 예제 및 데모 확인</p>
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
    </div>
  );
}
