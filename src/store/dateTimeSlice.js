import { createSlice } from '@reduxjs/toolkit';
import { 
  getCurrentTime, 
  getCurrentTimeFormatted, 
  getCurrentKoreanTime,
  getHolidays2025 
} from '../lib/moment-utils';

// Initial State
const initialState = {
  currentTime: getCurrentTime(),
  timezone: 'Asia/Seoul',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm:ss',
  showRelativeTime: true,
  holidays: getHolidays2025(),
  clockInterval: null,
  preferences: {
    showSeconds: true,
    use24Hour: true,
    showTimezone: false,
    autoRefresh: true
  }
};

// DateTime Slice
const dateTimeSlice = createSlice({
  name: 'dateTime',
  initialState,
  reducers: {
    updateCurrentTime: (state) => {
      state.currentTime = getCurrentTime();
    },
    setTimezone: (state, action) => {
      state.timezone = action.payload;
    },
    setDateFormat: (state, action) => {
      state.dateFormat = action.payload;
    },
    setTimeFormat: (state, action) => {
      state.timeFormat = action.payload;
    },
    toggleRelativeTime: (state) => {
      state.showRelativeTime = !state.showRelativeTime;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setClockInterval: (state, action) => {
      state.clockInterval = action.payload;
    },
    clearClockInterval: (state) => {
      state.clockInterval = null;
    },
    addHoliday: (state, action) => {
      state.holidays.push(action.payload);
    },
    removeHoliday: (state, action) => {
      state.holidays = state.holidays.filter(holiday => holiday.date !== action.payload);
    }
  }
});

export const {
  updateCurrentTime,
  setTimezone,
  setDateFormat,
  setTimeFormat,
  toggleRelativeTime,
  updatePreferences,
  setClockInterval,
  clearClockInterval,
  addHoliday,
  removeHoliday
} = dateTimeSlice.actions;

// Selectors
export const selectCurrentTime = (state) => state.dateTime.currentTime;
export const selectTimezone = (state) => state.dateTime.timezone;
export const selectDateFormat = (state) => state.dateTime.dateFormat;
export const selectTimeFormat = (state) => state.dateTime.timeFormat;
export const selectShowRelativeTime = (state) => state.dateTime.showRelativeTime;
export const selectHolidays = (state) => state.dateTime.holidays;
export const selectPreferences = (state) => state.dateTime.preferences;
export const selectClockInterval = (state) => state.dateTime.clockInterval;

// Complex Selectors
export const selectFormattedCurrentTime = (state) => {
  const preferences = selectPreferences(state);
  if (preferences.use24Hour) {
    return getCurrentTimeFormatted();
  } else {
    return getCurrentKoreanTime();
  }
};

export const selectUpcomingHolidays = (state) => {
  const holidays = selectHolidays(state);
  const now = new Date();
  return holidays
    .filter(holiday => new Date(holiday.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
};

export const selectTodayHolidays = (state) => {
  const holidays = selectHolidays(state);
  const today = new Date().toDateString();
  return holidays.filter(holiday => 
    new Date(holiday.date).toDateString() === today
  );
};

export default dateTimeSlice.reducer;
