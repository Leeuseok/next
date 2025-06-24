import moment from 'moment';
import 'moment/locale/ko'; // 한국어 로케일 추가

// 한국어로 설정
moment.locale('ko');

// 현재 시간 관련 함수들
export const getCurrentTime = () => moment();
export const getCurrentTimeFormatted = () => moment().format('YYYY-MM-DD HH:mm:ss');
export const getCurrentDate = () => moment().format('YYYY-MM-DD');
export const getCurrentKoreanTime = () => moment().format('YYYY년 MM월 DD일 dddd A hh시 mm분');

// 날짜 포맷팅 함수들
export const formatDate = (date, format = 'YYYY-MM-DD') => moment(date).format(format);
export const formatDateTime = (date) => moment(date).format('YYYY-MM-DD HH:mm:ss');
export const formatKoreanDate = (date) => moment(date).format('YYYY년 MM월 DD일 dddd');
export const formatRelativeTime = (date) => moment(date).fromNow();

// 날짜 계산 함수들
export const addDays = (date, days) => moment(date).add(days, 'days');
export const subtractDays = (date, days) => moment(date).subtract(days, 'days');
export const addWeeks = (date, weeks) => moment(date).add(weeks, 'weeks');
export const addMonths = (date, months) => moment(date).add(months, 'months');

// 날짜 비교 함수들
export const isAfter = (date1, date2) => moment(date1).isAfter(moment(date2));
export const isBefore = (date1, date2) => moment(date1).isBefore(moment(date2));
export const isSame = (date1, date2, unit = 'day') => moment(date1).isSame(moment(date2), unit);
export const getDaysDiff = (date1, date2) => moment(date1).diff(moment(date2), 'days');

// 유효성 검사
export const isValidDate = (date) => moment(date).isValid();

// 시작/끝 날짜
export const startOfDay = (date) => moment(date).startOf('day');
export const endOfDay = (date) => moment(date).endOf('day');
export const startOfWeek = (date) => moment(date).startOf('week');
export const endOfWeek = (date) => moment(date).endOf('week');
export const startOfMonth = (date) => moment(date).startOf('month');
export const endOfMonth = (date) => moment(date).endOf('month');

// 날짜 범위 생성
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const start = moment(startDate);
  const end = moment(endDate);
  
  while (start.isSameOrBefore(end)) {
    dates.push(start.clone());
    start.add(1, 'day');
  }
  
  return dates;
};

// 업무일 계산 (주말 제외)
export const getBusinessDays = (startDate, endDate) => {
  let count = 0;
  const start = moment(startDate);
  const end = moment(endDate);
  
  while (start.isSameOrBefore(end)) {
    if (start.day() !== 0 && start.day() !== 6) { // 일요일(0), 토요일(6) 제외
      count++;
    }
    start.add(1, 'day');
  }
  
  return count;
};

// 다음/이전 업무일
export const getNextBusinessDay = (date) => {
  const next = moment(date).add(1, 'day');
  while (next.day() === 0 || next.day() === 6) {
    next.add(1, 'day');
  }
  return next;
};

export const getPreviousBusinessDay = (date) => {
  const prev = moment(date).subtract(1, 'day');
  while (prev.day() === 0 || prev.day() === 6) {
    prev.subtract(1, 'day');
  }
  return prev;
};

// 특별한 날짜들
export const getHolidays2025 = () => [
  { name: '신정', date: '2025-01-01' },
  { name: '설날 연휴', date: '2025-01-28' },
  { name: '설날', date: '2025-01-29' },
  { name: '설날 연휴', date: '2025-01-30' },
  { name: '삼일절', date: '2025-03-01' },
  { name: '어린이날', date: '2025-05-05' },
  { name: '부처님오신날', date: '2025-05-05' },
  { name: '현충일', date: '2025-06-06' },
  { name: '광복절', date: '2025-08-15' },
  { name: '추석 연휴', date: '2025-10-05' },
  { name: '추석', date: '2025-10-06' },
  { name: '추석 연휴', date: '2025-10-07' },
  { name: '개천절', date: '2025-10-03' },
  { name: '한글날', date: '2025-10-09' },
  { name: '크리스마스', date: '2025-12-25' }
];

// 나이 계산
export const calculateAge = (birthDate) => {
  return moment().diff(moment(birthDate), 'years');
};

// D-Day 계산
export const calculateDDay = (targetDate) => {
  const today = moment().startOf('day');
  const target = moment(targetDate).startOf('day');
  const diff = target.diff(today, 'days');
  
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
};

// 요일별 분석
export const getWeekdayStats = (dates) => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const stats = {};
  
  weekdays.forEach(day => stats[day] = 0);
  
  dates.forEach(date => {
    const dayName = moment(date).format('dddd');
    const shortDay = dayName.charAt(0);
    stats[shortDay]++;
  });
  
  return stats;
};

// 시간대별 분석
export const getHourlyStats = (dates) => {
  const hours = Array.from({length: 24}, (_, i) => i);
  const stats = {};
  
  hours.forEach(hour => stats[hour] = 0);
  
  dates.forEach(date => {
    const hour = moment(date).hour();
    stats[hour]++;
  });
  
  return stats;
};
