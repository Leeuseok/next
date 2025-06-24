import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  updateCurrentTime,
  setTimezone,
  setDateFormat,
  setTimeFormat,
  toggleRelativeTime,
  updatePreferences,
  selectCurrentTime,
  selectTimezone,
  selectDateFormat,
  selectTimeFormat,
  selectShowRelativeTime,
  selectHolidays,
  selectPreferences,
  selectFormattedCurrentTime,
  selectUpcomingHolidays,
  selectTodayHolidays
} from '../store/dateTimeSlice';

export const useReduxDateTime = () => {
  const dispatch = useDispatch();
  
  const currentTime = useSelector(selectCurrentTime);
  const timezone = useSelector(selectTimezone);
  const dateFormat = useSelector(selectDateFormat);
  const timeFormat = useSelector(selectTimeFormat);
  const showRelativeTime = useSelector(selectShowRelativeTime);
  const holidays = useSelector(selectHolidays);
  const preferences = useSelector(selectPreferences);
  const formattedCurrentTime = useSelector(selectFormattedCurrentTime);
  const upcomingHolidays = useSelector(selectUpcomingHolidays);
  const todayHolidays = useSelector(selectTodayHolidays);

  const refreshTime = useCallback(() => {
    dispatch(updateCurrentTime());
  }, [dispatch]);

  const changeTimezone = useCallback((newTimezone) => {
    dispatch(setTimezone(newTimezone));
  }, [dispatch]);

  const changeDateFormat = useCallback((format) => {
    dispatch(setDateFormat(format));
  }, [dispatch]);

  const changeTimeFormat = useCallback((format) => {
    dispatch(setTimeFormat(format));
  }, [dispatch]);

  const toggleRelativeTimeDisplay = useCallback(() => {
    dispatch(toggleRelativeTime());
  }, [dispatch]);

  const updateDateTimePreferences = useCallback((newPreferences) => {
    dispatch(updatePreferences(newPreferences));
  }, [dispatch]);

  // 자동 시간 업데이트
  useEffect(() => {
    if (preferences.autoRefresh) {
      const interval = setInterval(() => {
        refreshTime();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [preferences.autoRefresh, refreshTime]);

  // 초기 시간 설정
  useEffect(() => {
    refreshTime();
  }, [refreshTime]);

  return {
    // Current State
    currentTime,
    timezone,
    dateFormat,
    timeFormat,
    showRelativeTime,
    holidays,
    preferences,
    formattedCurrentTime,
    upcomingHolidays,
    todayHolidays,
    
    // Actions
    refreshTime,
    changeTimezone,
    changeDateFormat,
    changeTimeFormat,
    toggleRelativeTimeDisplay,
    updateDateTimePreferences
  };
};
