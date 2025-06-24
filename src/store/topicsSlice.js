import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API 베이스 URL
const API_BASE_URL = 'http://localhost:3001';

// Async Thunks
export const fetchTopics = createAsyncThunk(
  'topics/fetchTopics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/topics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTopic = createAsyncThunk(
  'topics/createTopic',
  async (topicData, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const response = await axios.post(`${API_BASE_URL}/topics`, {
        ...topicData,
        createdAt: now,
        updatedAt: now
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTopic = createAsyncThunk(
  'topics/updateTopic',
  async ({ id, ...topicData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/topics/${id}`, {
        ...topicData,
        updatedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTopic = createAsyncThunk(
  'topics/deleteTopic',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/topics/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopicById = createAsyncThunk(
  'topics/fetchTopicById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/topics/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  topics: [],
  currentTopic: null,
  loading: false,
  saving: false,
  error: null,
  lastUpdated: null,
  statistics: {
    total: 0,
    createdToday: 0,
    updatedToday: 0
  }
};

// Topics Slice
const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTopic: (state) => {
      state.currentTopic = null;
    },
    updateStatistics: (state) => {
      const today = new Date().toDateString();
      state.statistics = {
        total: state.topics.length,
        createdToday: state.topics.filter(topic => 
          topic.createdAt && new Date(topic.createdAt).toDateString() === today
        ).length,
        updatedToday: state.topics.filter(topic => 
          topic.updatedAt && 
          topic.updatedAt !== topic.createdAt &&
          new Date(topic.updatedAt).toDateString() === today
        ).length
      };
    },
    setTopics: (state, action) => {
      state.topics = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Topics
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
        state.lastUpdated = new Date().toISOString();
        topicsSlice.caseReducers.updateStatistics(state);
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '주제를 불러오는데 실패했습니다.';
      })

      // Create Topic
      .addCase(createTopic.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.saving = false;
        state.topics.push(action.payload);
        topicsSlice.caseReducers.updateStatistics(state);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || '주제 생성에 실패했습니다.';
      })

      // Update Topic
      .addCase(updateTopic.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.topics.findIndex(topic => topic.id === action.payload.id);
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
        if (state.currentTopic && state.currentTopic.id === action.payload.id) {
          state.currentTopic = action.payload;
        }
        topicsSlice.caseReducers.updateStatistics(state);
      })
      .addCase(updateTopic.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || '주제 수정에 실패했습니다.';
      })

      // Delete Topic
      .addCase(deleteTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = state.topics.filter(topic => topic.id !== action.payload);
        topicsSlice.caseReducers.updateStatistics(state);
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '주제 삭제에 실패했습니다.';
      })

      // Fetch Topic By ID
      .addCase(fetchTopicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTopic = action.payload;
      })
      .addCase(fetchTopicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '주제를 찾을 수 없습니다.';
      });
  }
});

export const { clearError, clearCurrentTopic, updateStatistics, setTopics } = topicsSlice.actions;

// Selectors
export const selectAllTopics = (state) => state.topics.topics;
export const selectCurrentTopic = (state) => state.topics.currentTopic;
export const selectTopicsLoading = (state) => state.topics.loading;
export const selectTopicsSaving = (state) => state.topics.saving;
export const selectTopicsError = (state) => state.topics.error;
export const selectTopicsStatistics = (state) => state.topics.statistics;
export const selectLastUpdated = (state) => state.topics.lastUpdated;

// Complex Selectors
export const selectRecentTopics = (state) => {
  const topics = selectAllTopics(state);
  return topics
    .filter(topic => topic.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
};

export const selectTopicsByDateRange = (state, startDate, endDate) => {
  const topics = selectAllTopics(state);
  return topics.filter(topic => {
    if (!topic.createdAt) return false;
    const topicDate = new Date(topic.createdAt);
    return topicDate >= new Date(startDate) && topicDate <= new Date(endDate);
  });
};

export default topicsSlice.reducer;
