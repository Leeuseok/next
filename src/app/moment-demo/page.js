'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import moment from 'moment';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 relative overflow-hidden">
      {/* 배경 파티클 효과 */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              background: `hsl(${Math.random() * 360}, 70%, 70%)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 modern-card bg-white bg-opacity-70 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300"
          >
            <span className="mr-2">←</span> 홈으로 돌아가기
          </Link>
          <h1 className="text-6xl font-bold gradient-text-rainbow mb-6 floating">
            Moment.js 마법의 시간 ⏰
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            시간을 다루는 모든 방법을 체험해보세요. 날짜 계산부터 D-Day, 공휴일까지!
          </p>
        </div>

        {/* 실시간 시계 */}
        <div className="glass-card p-8 mb-12 modern-card floating">
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow">🕒</span>
            실시간 마법의 시계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-3xl modern-card spectrum-border">
              <h3 className="font-bold text-blue-900 mb-4 text-xl flex items-center">
                <span className="mr-2 animate-pulse">⏰</span>
                현재 시간
              </h3>
              <p className="text-3xl text-blue-800 font-mono typing-cursor">
                {currentTime ? getCurrentTimeFormatted() : '로딩 중...'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-3xl modern-card spectrum-border">
              <h3 className="font-bold text-green-900 mb-4 text-xl flex items-center">
                <span className="mr-2 floating">🇰🇷</span>
                한국어 형식
              </h3>
              <p className="text-3xl text-green-800 font-bold">
                {currentTime ? getCurrentKoreanTime() : '로딩 중...'}
              </p>
            </div>
          </div>
        </div>

        {/* 날짜 입력 및 포맷팅 */}
        <div className="glass-card p-8 mb-12 modern-card floating" style={{animationDelay: '0.6s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow">📅</span>
            날짜 변환 마법사
          </h2>
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2 animate-pulse">✨</span>
              마법의 날짜를 선택하세요:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg modern-card bg-white bg-opacity-90"
            />
          </div>
          
          {selectedDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-purple-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 floating">🎨</span>
                  기본 형식
                </h3>
                <p className="text-xl text-purple-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{formatDate(selectedDate)}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-indigo-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 animate-spin-slow">⚡</span>
                  날짜+시간
                </h3>
                <p className="text-xl text-indigo-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{formatDateTime(selectedDate)}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-pink-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 floating">🇰🇷</span>
                  한국어
                </h3>
                <p className="text-xl text-pink-800 font-bold bg-white bg-opacity-60 p-3 rounded-lg">{formatKoreanDate(selectedDate)}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-yellow-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 animate-bounce">⏰</span>
                  상대시간
                </h3>
                <p className="text-xl text-yellow-800 font-bold bg-white bg-opacity-60 p-3 rounded-lg">{formatRelativeTime(selectedDate)}</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-red-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 neon-glow">🚀</span>
                  7일 후
                </h3>
                <p className="text-xl text-red-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{addDays(selectedDate, 7).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-teal-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 animate-pulse">⏪</span>
                  1개월 전
                </h3>
                <p className="text-xl text-teal-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{subtractDays(selectedDate, 30).format('YYYY-MM-DD')}</p>
              </div>
            </div>
          )}
        </div>

        {/* D-Day 계산기 */}
        <div className="glass-card p-8 mb-12 modern-card floating" style={{animationDelay: '0.3s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow text-red-400">🎯</span>
            D-Day 마법 계산기
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📅</span>
                목표 날짜를 선택하세요:
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg modern-card bg-white bg-opacity-90"
              />
            </div>
            
            {targetDate && (
              <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8 rounded-3xl modern-card neon-glow">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                    <span className="mr-2 animate-bounce">🎊</span>
                    {formatKoreanDate(targetDate)}까지
                  </h3>
                  <p className="text-6xl font-bold gradient-text-rainbow mb-4">
                    {calculateDDay(targetDate)}
                  </p>
                  <p className="text-lg text-gray-600">
                    총 <span className="font-bold text-purple-600">{Math.abs(getDaysDiff(targetDate, getCurrentDate()))}</span>일
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 나이 계산기 */}
        <div className="glass-card p-8 mb-12 modern-card floating" style={{animationDelay: '0.9s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow animate-bounce">🎂</span>
            나이 계산기 마법사
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2 floating">🎈</span>
                생년월일을 알려주세요:
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg modern-card bg-white bg-opacity-90"
              />
            </div>
            
            {birthDate && (
              <div className="bg-gradient-to-br from-green-100 via-emerald-100 to-blue-100 p-8 rounded-3xl modern-card neon-glow">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                    <span className="mr-2 animate-spin-slow">🌟</span>
                    당신의 현재 나이
                  </h3>
                  <p className="text-6xl font-bold gradient-text-rainbow mb-4">
                    {calculateAge(birthDate)}세
                  </p>
                  <p className="text-lg text-gray-600 font-semibold bg-white bg-opacity-60 p-3 rounded-lg">
                    생일: {formatKoreanDate(birthDate)}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-70 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">태어난 지</p>
                      <p className="text-xl font-bold text-purple-600">
                        {getDaysDiff(getCurrentDate(), birthDate)}일
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-70 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">다음 생일까지</p>
                      <p className="text-xl font-bold text-pink-600">
                        {birthDate ? (() => {
                          const today = moment();
                          const thisYearBirthday = moment(birthDate).year(today.year());
                          const nextBirthday = thisYearBirthday.isBefore(today) ? 
                            thisYearBirthday.add(1, 'year') : thisYearBirthday;
                          return nextBirthday.diff(today, 'days');
                        })() : '0'}일
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 날짜 범위 분석 */}
        <div className="glass-card p-8 mb-12 modern-card floating" style={{animationDelay: '1.2s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow">📊</span>
            날짜 범위 분석 센터
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2 animate-pulse">🚀</span>
                시작 날짜:
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg modern-card bg-white bg-opacity-90"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2 neon-glow">🏁</span>
                종료 날짜:
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg modern-card bg-white bg-opacity-90"
              />
            </div>
          </div>
          
          {dateRange.start && dateRange.end && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <h3 className="font-bold text-blue-900 mb-4 text-lg flex items-center justify-center">
                    <span className="mr-2 floating">📅</span>
                    총 일수
                  </h3>
                  <p className="text-5xl font-bold text-blue-600 mb-2">
                    {getDaysDiff(dateRange.end, dateRange.start) + 1}
                  </p>
                  <p className="text-lg text-blue-700">일</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <h3 className="font-bold text-green-900 mb-4 text-lg flex items-center justify-center">
                    <span className="mr-2 animate-pulse">💼</span>
                    업무일
                  </h3>
                  <p className="text-5xl font-bold text-green-600 mb-2">
                    {getBusinessDays(dateRange.start, dateRange.end)}
                  </p>
                  <p className="text-lg text-green-700">일</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <h3 className="font-bold text-purple-900 mb-4 text-lg flex items-center justify-center">
                    <span className="mr-2 animate-bounce">🎉</span>
                    주말
                  </h3>
                  <p className="text-5xl font-bold text-purple-600 mb-2">
                    {getDaysDiff(dateRange.end, dateRange.start) + 1 - getBusinessDays(dateRange.start, dateRange.end)}
                  </p>
                  <p className="text-lg text-purple-700">일</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2025년 공휴일 */}
        <div className="glass-card p-8 mb-12 modern-card floating" style={{animationDelay: '1.5s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow animate-pulse">🏮</span>
            2025년 대한민국 공휴일
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {holidays.map((holiday, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-red-100 via-pink-100 to-orange-100 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                style={{animationDelay: `${1.8 + index * 0.1}s`}}
              >
                <div className="text-center">
                  <h3 className="font-bold text-red-900 mb-3 text-lg flex items-center justify-center">
                    <span className="mr-2 neon-glow">🎊</span>
                    {holiday.name}
                  </h3>
                  <p className="text-xl text-red-700 font-bold bg-white bg-opacity-60 p-3 rounded-lg mb-3">
                    {formatKoreanDate(holiday.date)}
                  </p>
                  <p className="text-sm text-red-600 font-semibold bg-red-50 p-2 rounded-lg">
                    {formatRelativeTime(holiday.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 업무일 계산 */}
        <div className="glass-card p-8 mb-12 modern-card floating" style={{animationDelay: '1.8s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow">💼</span>
            업무일 계산 센터
          </h2>
          {selectedDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-100 to-amber-200 p-8 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <h3 className="font-bold text-orange-900 mb-4 text-xl flex items-center justify-center">
                    <span className="mr-2 floating">⏭️</span>
                    다음 업무일
                  </h3>
                  <p className="text-2xl text-orange-800 font-bold bg-white bg-opacity-60 p-4 rounded-lg">
                    {formatKoreanDate(getNextBusinessDay(selectedDate))}
                  </p>
                  <p className="text-sm text-orange-600 mt-3 font-semibold">
                    {formatRelativeTime(getNextBusinessDay(selectedDate))}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-100 to-blue-200 p-8 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <h3 className="font-bold text-cyan-900 mb-4 text-xl flex items-center justify-center">
                    <span className="mr-2 animate-pulse">⏮️</span>
                    이전 업무일
                  </h3>
                  <p className="text-2xl text-cyan-800 font-bold bg-white bg-opacity-60 p-4 rounded-lg">
                    {formatKoreanDate(getPreviousBusinessDay(selectedDate))}
                  </p>
                  <p className="text-sm text-cyan-600 mt-3 font-semibold">
                    {formatRelativeTime(getPreviousBusinessDay(selectedDate))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 날짜 범위의 시작/끝 */}
        <div className="glass-card p-8 mb-12 modern-card floating" style={{animationDelay: '2.1s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow animate-spin-slow">⏰</span>
            시간 범위 마법사
          </h2>
          {selectedDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-100 to-gray-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-slate-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 floating">🌅</span>
                  하루 시작
                </h3>
                <p className="text-lg text-slate-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{startOfDay(selectedDate).format('YYYY-MM-DD HH:mm:ss')}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-gray-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-slate-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 neon-glow">🌆</span>
                  하루 끝
                </h3>
                <p className="text-lg text-slate-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{endOfDay(selectedDate).format('YYYY-MM-DD HH:mm:ss')}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-green-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-emerald-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 animate-pulse">📅</span>
                  주 시작
                </h3>
                <p className="text-lg text-emerald-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{startOfWeek(selectedDate).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-green-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-emerald-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 animate-bounce">🏁</span>
                  주 끝
                </h3>
                <p className="text-lg text-emerald-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{endOfWeek(selectedDate).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-yellow-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-amber-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 neon-glow">🗓️</span>
                  월 시작
                </h3>
                <p className="text-lg text-amber-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{startOfMonth(selectedDate).format('YYYY-MM-DD')}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-yellow-200 p-6 rounded-3xl modern-card spectrum-border transform hover:scale-105 transition-all duration-300">
                <h3 className="font-bold text-amber-900 mb-3 text-lg flex items-center">
                  <span className="mr-2 floating">📊</span>
                  월 끝
                </h3>
                <p className="text-lg text-amber-800 font-mono bg-white bg-opacity-60 p-3 rounded-lg">{endOfMonth(selectedDate).format('YYYY-MM-DD')}</p>
              </div>
            </div>
          )}
        </div>

        {/* 추가 인터랙티브 섹션 */}
        <div className="glass-card p-8 mb-12 modern-card floating matrix-bg" style={{animationDelay: '2.4s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center">
            <span className="text-4xl mr-4 neon-glow holographic">🎯</span>
            시간 여행 시뮬레이터
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-200 to-pink-200 p-6 rounded-3xl modern-card spectrum-border-enhanced transform hover:scale-105 transition-all duration-300 ripple-effect">
              <div className="text-center">
                <h3 className="font-bold text-purple-900 mb-3 text-lg flex items-center justify-center">
                  <span className="mr-2 animate-spin-slow">🌍</span>
                  1년 후
                </h3>
                <p className="text-lg text-purple-800 font-mono bg-white bg-opacity-70 p-3 rounded-lg">
                  {selectedDate ? addDays(selectedDate, 365).format('YYYY년 MM월 DD일') : '날짜를 선택하세요'}
                </p>
                <p className="text-sm text-purple-600 mt-2 font-semibold">
                  {selectedDate ? addDays(selectedDate, 365).format('dddd') : ''}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-200 to-cyan-200 p-6 rounded-3xl modern-card spectrum-border-enhanced transform hover:scale-105 transition-all duration-300 ripple-effect">
              <div className="text-center">
                <h3 className="font-bold text-blue-900 mb-3 text-lg flex items-center justify-center">
                  <span className="mr-2 floating">🕰️</span>
                  100일 전
                </h3>
                <p className="text-lg text-blue-800 font-mono bg-white bg-opacity-70 p-3 rounded-lg">
                  {selectedDate ? subtractDays(selectedDate, 100).format('YYYY년 MM월 DD일') : '날짜를 선택하세요'}
                </p>
                <p className="text-sm text-blue-600 mt-2 font-semibold">
                  {selectedDate ? subtractDays(selectedDate, 100).format('dddd') : ''}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-200 to-emerald-200 p-6 rounded-3xl modern-card spectrum-border-enhanced transform hover:scale-105 transition-all duration-300 ripple-effect">
              <div className="text-center">
                <h3 className="font-bold text-green-900 mb-3 text-lg flex items-center justify-center">
                  <span className="mr-2 heartbeat">💚</span>
                  10년 후
                </h3>
                <p className="text-lg text-green-800 font-mono bg-white bg-opacity-70 p-3 rounded-lg">
                  {selectedDate ? addDays(selectedDate, 3650).format('YYYY년 MM월 DD일') : '날짜를 선택하세요'}
                </p>                  <p className="text-sm text-green-600 mt-2 font-semibold">
                    {selectedDate && birthDate ? `${calculateAge(birthDate) + 10}세가 되는 해` : ''}
                  </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-200 to-red-200 p-6 rounded-3xl modern-card spectrum-border-enhanced transform hover:scale-105 transition-all duration-300 ripple-effect">
              <div className="text-center">
                <h3 className="font-bold text-orange-900 mb-3 text-lg flex items-center justify-center">
                  <span className="mr-2 neon-glow morphing">🚀</span>
                  우주 시간
                </h3>
                <p className="text-lg text-orange-800 font-mono bg-white bg-opacity-70 p-3 rounded-lg">
                  {getCurrentTime() ? getCurrentTime().valueOf() : '로딩 중...'}
                </p>
                <p className="text-sm text-orange-600 mt-2 font-semibold scanlines">
                  Unix Timestamp
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 마법의 시간 통계 */}
        <div className="glass-card p-8 mb-12 modern-card floating data-stream" style={{animationDelay: '2.7s'}}>
          <h2 className="text-3xl font-bold mb-6 gradient-text rainbow-text flex items-center">
            <span className="text-4xl mr-4 neon-glow">📊</span>
            마법의 시간 통계
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-200 p-6 rounded-3xl modern-card effect-3d">
              <div className="text-center">
                <h3 className="font-bold text-indigo-900 mb-3 text-lg">🌅 오늘까지</h3>
                <p className="text-3xl font-bold text-indigo-800 mb-2">
                  {birthDate ? getDaysDiff(getCurrentDate(), birthDate) : '0'}
                </p>
                <p className="text-sm text-indigo-600">일을 살았어요</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-red-200 p-6 rounded-3xl modern-card effect-3d">
              <div className="text-center">
                <h3 className="font-bold text-pink-900 mb-3 text-lg">💖 심장박동</h3>
                <p className="text-3xl font-bold text-pink-800 mb-2">
                  {birthDate ? Math.floor(getDaysDiff(getCurrentDate(), birthDate) * 100000).toLocaleString() : '0'}
                </p>
                <p className="text-sm text-pink-600">번 뛰었어요</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-orange-200 p-6 rounded-3xl modern-card effect-3d">
              <div className="text-center">
                <h3 className="font-bold text-yellow-900 mb-3 text-lg">🌙 밤의 수</h3>
                <p className="text-3xl font-bold text-yellow-800 mb-2">
                  {birthDate ? getDaysDiff(getCurrentDate(), birthDate) : '0'}
                </p>
                <p className="text-sm text-yellow-600">번 잠들었어요</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-teal-200 p-6 rounded-3xl modern-card effect-3d">
              <div className="text-center">
                <h3 className="font-bold text-green-900 mb-3 text-lg">🌟 특별한 순간</h3>
                <p className="text-3xl font-bold text-green-800 mb-2">
                  {birthDate ? Math.floor(getDaysDiff(getCurrentDate(), birthDate) / 365 * 12) : '0'}
                </p>
                <p className="text-sm text-green-600">번의 생일</p>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="glass-card p-8 modern-card floating holographic" style={{animationDelay: '3s'}}>
          <div className="text-center">
            <h3 className="text-2xl font-bold gradient-text-rainbow mb-4">
              ✨ 시간의 마법사가 되어보세요! ✨
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Moment.js와 함께하는 시간 여행은 여기서 끝이 아닙니다. 
              더 많은 마법을 경험하고 싶다면 홈으로 돌아가세요!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/" 
                className="modern-card bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all duration-300 neon-glow ripple-effect"
              >
                🏠 홈으로 돌아가기
              </Link>
              <Link 
                href="/redux-demo" 
                className="modern-card bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all duration-300 neon-glow ripple-effect"
              >
                🔮 Redux 마법 체험
              </Link>
              <Link 
                href="/create" 
                className="modern-card bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all duration-300 neon-glow ripple-effect"
              >
                ➕ 새로운 모험 시작
              </Link>
            </div>
          </div>
        </div>

        {/* 마법의 파티클 추가 효과 */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`magic-${i}`}
              className="absolute w-2 h-2 bg-white rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                background: `hsl(${Math.random() * 360}, 80%, 80%)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
