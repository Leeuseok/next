'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getCurrentTime,
  getCurrentTimeFormatted,
  getCurrentDate,
  getCurrentKoreanTime,
  formatDate,
  formatDateTime,
  formatKoreanDate,
  formatRelativeTime,
  addDays,
  subtractDays,
  addWeeks,
  addMonths,
  isAfter,
  isBefore,
  isSame,
  getDaysDiff,
  isValidDate,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  getDatesInRange,
  getBusinessDays,
  getNextBusinessDay,
  getPreviousBusinessDay,
  getHolidays2025,
  calculateAge,
  calculateDDay,
  getWeekdayStats,
  getHourlyStats
} from '../../lib/moment-utils';

export default function MomentDemo() {
  const [currentTime, setCurrentTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // 실시간 시계
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 초기값 설정
  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
    setTargetDate('2025-12-25'); // 크리스마스
    setBirthDate('1990-01-01');
    setDateRange({ 
      start: today, 
      end: addDays(today, 7).format('YYYY-MM-DD') 
    });
  }, []);

  const holidays = getHolidays2025();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Moment.js 데모 페이지
          </h1>
          <p className="text-gray-600">
            다양한 날짜/시간 유틸리티 함수들을 실제로 사용해보세요.
          </p>
        </div>

        {/* 실시간 시계 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🕒 실시간 시계</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">현재 시간</h3>
              <p className="text-lg text-blue-800">
                {currentTime ? getCurrentTimeFormatted() : '로딩 중...'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">한국어 형식</h3>
              <p className="text-lg text-green-800">
                {currentTime ? getCurrentKoreanTime() : '로딩 중...'}
              </p>
            </div>
          </div>
        </div>

        {/* 날짜 입력 및 포맷팅 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 날짜 포맷팅</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날짜 선택:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          {selectedDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">기본 형식</h3>
                <p className="text-purple-800">{formatDate(selectedDate)}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">날짜+시간</h3>
                <p className="text-indigo-800">{formatDateTime(selectedDate)}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-900 mb-2">한국어</h3>
                <p className="text-pink-800">{formatKoreanDate(selectedDate)}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">상대시간</h3>
                <p className="text-yellow-800">{formatRelativeTime(selectedDate)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">7일 후</h3>
                <p className="text-red-800">{addDays(selectedDate, 7).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-900 mb-2">1개월 전</h3>
                <p className="text-teal-800">{subtractDays(selectedDate, 30).format('YYYY-MM-DD')}</p>
              </div>
            </div>
          )}
        </div>

        {/* D-Day 계산기 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 D-Day 계산기</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              목표 날짜:
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          {targetDate && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {formatKoreanDate(targetDate)}까지
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {calculateDDay(targetDate)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {getDaysDiff(targetDate, getCurrentDate())}일 남음
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 나이 계산기 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎂 나이 계산기</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              생년월일:
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          {birthDate && (
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  현재 나이
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {calculateAge(birthDate)}세
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  생일: {formatKoreanDate(birthDate)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 날짜 범위 분석 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 날짜 범위 분석</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작 날짜:
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종료 날짜:
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          {dateRange.start && dateRange.end && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">총 일수</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {getDaysDiff(dateRange.end, dateRange.start) + 1}일
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">업무일</h3>
                <p className="text-2xl font-bold text-green-600">
                  {getBusinessDays(dateRange.start, dateRange.end)}일
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">주말</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {getDaysDiff(dateRange.end, dateRange.start) + 1 - getBusinessDays(dateRange.start, dateRange.end)}일
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2025년 공휴일 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🏮 2025년 공휴일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidays.map((holiday, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-900 mb-1">{holiday.name}</h3>
                <p className="text-red-700">{formatKoreanDate(holiday.date)}</p>
                <p className="text-sm text-red-600 mt-1">
                  {formatRelativeTime(holiday.date)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 업무일 계산 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💼 업무일 계산</h2>
          {selectedDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">다음 업무일</h3>
                <p className="text-lg text-orange-800">
                  {formatKoreanDate(getNextBusinessDay(selectedDate))}
                </p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h3 className="font-semibold text-cyan-900 mb-2">이전 업무일</h3>
                <p className="text-lg text-cyan-800">
                  {formatKoreanDate(getPreviousBusinessDay(selectedDate))}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 날짜 범위의 시작/끝 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">⏰ 시간 범위</h2>
          {selectedDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">하루 시작</h3>
                <p className="text-slate-800">{startOfDay(selectedDate).format('YYYY-MM-DD HH:mm:ss')}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">하루 끝</h3>
                <p className="text-slate-800">{endOfDay(selectedDate).format('YYYY-MM-DD HH:mm:ss')}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-900 mb-2">주 시작</h3>
                <p className="text-emerald-800">{startOfWeek(selectedDate).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-900 mb-2">주 끝</h3>
                <p className="text-emerald-800">{endOfWeek(selectedDate).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-2">월 시작</h3>
                <p className="text-amber-800">{startOfMonth(selectedDate).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-2">월 끝</h3>
                <p className="text-amber-800">{endOfMonth(selectedDate).format('YYYY-MM-DD')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
