'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useReduxTopics } from '../../hooks/useReduxTopics';
import { useReduxDateTime } from '../../hooks/useReduxDateTime';
import {
  selectAllTopics,
  selectTopicsLoading,
  selectTopicsError,
  selectTopicsStatistics,
  clearError
} from '../../store/topicsSlice';
import {
  selectCurrentTime,
  selectPreferences,
  updatePreferences,
  toggleRelativeTime
} from '../../store/dateTimeSlice';
import { formatRelativeTime, formatKoreanDate } from '../../lib/moment-utils';

export default function ReduxDemo() {
  const dispatch = useDispatch();
  
  // Redux Selectors 직접 사용
  const allTopics = useSelector(selectAllTopics);
  const loading = useSelector(selectTopicsLoading);
  const error = useSelector(selectTopicsError);
  const statistics = useSelector(selectTopicsStatistics);
  const currentTime = useSelector(selectCurrentTime);
  const preferences = useSelector(selectPreferences);
  
  // Custom Hooks 사용
  const { loadTopics, clearError: clearTopicsError } = useReduxTopics();
  const { 
    formattedCurrentTime, 
    toggleRelativeTimeDisplay,
    updateDateTimePreferences 
  } = useReduxDateTime();

  const [showRawState, setShowRawState] = useState(false);

  const handlePreferenceChange = (key, value) => {
    updateDateTimePreferences({ [key]: value });
  };

  // Redux store의 전체 상태를 가져오기 (데모용)
  const fullState = useSelector(state => state);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8 relative overflow-hidden">
      {/* 배경 파티클 효과 */}
      <div className="particles">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              background: `hsl(${240 + Math.random() * 120}, 70%, 70%)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 modern-card bg-white bg-opacity-70 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 font-semibold"
          >
            <span className="mr-2">←</span> 홈으로 돌아가기
          </Link>
          <h1 className="text-6xl font-bold gradient-text-rainbow mb-6 floating">
            Redux Toolkit 상태 마법사 🏪
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Redux의 강력한 상태 관리와 실시간 데이터 동기화를 직접 체험해보세요.
          </p>
        </div>

        {/* Redux 상태 표시 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Topics State */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📚</span>
              Topics Redux 상태
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">통계 정보</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">{statistics.total}</div>
                    <div className="text-blue-700">전체</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">{statistics.createdToday}</div>
                    <div className="text-green-700">오늘 생성</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-purple-600">{statistics.updatedToday}</div>
                    <div className="text-purple-700">오늘 수정</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">상태 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Loading:</span>
                    <span className={loading ? 'text-yellow-600' : 'text-green-600'}>
                      {loading ? '로딩 중...' : '완료'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error:</span>
                    <span className={error ? 'text-red-600' : 'text-green-600'}>
                      {error || '없음'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Topics 수:</span>
                    <span className="font-semibold">{allTopics.length}개</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-red-700">{error}</span>
                    <button
                      onClick={() => clearTopicsError()}
                      className="text-red-600 hover:text-red-800 underline text-sm"
                    >
                      에러 지우기
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => loadTopics()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? '로딩 중...' : '데이터 새로고침'}
                </button>
              </div>
            </div>
          </div>

          {/* DateTime State */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">⏰</span>
              DateTime Redux 상태
            </h2>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">현재 시간</h3>
                <div className="text-lg font-mono text-green-700">
                  {formattedCurrentTime}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  실시간 업데이트: {preferences.autoRefresh ? '활성화' : '비활성화'}
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-3">환경 설정</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.showSeconds}
                      onChange={(e) => handlePreferenceChange('showSeconds', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">초 표시</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.use24Hour}
                      onChange={(e) => handlePreferenceChange('use24Hour', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">24시간 형식</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.autoRefresh}
                      onChange={(e) => handlePreferenceChange('autoRefresh', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">자동 새로고침</span>
                  </label>
                </div>
              </div>

              <button
                onClick={toggleRelativeTimeDisplay}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              >
                상대시간 표시 토글
              </button>
            </div>
          </div>
        </div>

        {/* Redux DevTools 정보 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🛠️</span>
            Redux DevTools & 디버깅
          </h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Redux DevTools 사용법</h3>
              <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
                <li>브라우저 개발자 도구에서 "Redux" 탭 열기</li>
                <li>액션 디스패치 시 실시간으로 상태 변화 확인</li>
                <li>시간 여행 디버깅으로 이전 상태로 되돌리기</li>
                <li>액션 로그와 상태 diff 확인</li>
              </ol>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRawState(!showRawState)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                {showRawState ? '원시 상태 숨기기' : '원시 상태 보기'}
              </button>
            </div>

            {showRawState && (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                <h4 className="text-white mb-2 font-semibold">Redux Store 전체 상태:</h4>
                <pre className="text-xs">
                  {JSON.stringify(fullState, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 액션 테스트 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🚀</span>
            액션 디스패치 테스트
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Topics 액션</h3>
              <div className="space-y-2">
                <button
                  onClick={() => loadTopics()}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  fetchTopics 액션 디스패치
                </button>
                <button
                  onClick={() => clearTopicsError()}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  clearError 액션 디스패치
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">DateTime 액션</h3>
              <div className="space-y-2">
                <button
                  onClick={toggleRelativeTimeDisplay}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  toggleRelativeTime 액션
                </button>
                <button
                  onClick={() => updateDateTimePreferences({ showTimezone: !preferences.showTimezone })}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                >
                  updatePreferences 액션
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 Topics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📋</span>
            최근 Topics (Redux에서 가져옴)
          </h2>
          
          {allTopics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              아직 주제가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {allTopics.slice(0, 5).map((topic) => (
                <div key={topic.id} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{topic.body.substring(0, 100)}...</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>ID: {topic.id}</div>
                      {topic.createdAt && (
                        <div>{formatRelativeTime(topic.createdAt)}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
