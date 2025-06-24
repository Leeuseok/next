import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  fetchTopicById,
  clearError,
  clearCurrentTopic,
  selectAllTopics,
  selectCurrentTopic,
  selectTopicsLoading,
  selectTopicsSaving,
  selectTopicsError,
  selectTopicsStatistics,
  selectRecentTopics
} from '../store/topicsSlice';

export const useReduxTopics = () => {
  const dispatch = useDispatch();
  
  const topics = useSelector(selectAllTopics);
  const currentTopic = useSelector(selectCurrentTopic);
  const loading = useSelector(selectTopicsLoading);
  const saving = useSelector(selectTopicsSaving);
  const error = useSelector(selectTopicsError);
  const statistics = useSelector(selectTopicsStatistics);
  const recentTopics = useSelector(selectRecentTopics);

  const loadTopics = useCallback(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const addTopic = useCallback((topicData) => {
    return dispatch(createTopic(topicData));
  }, [dispatch]);

  const editTopic = useCallback((id, topicData) => {
    return dispatch(updateTopic({ id, ...topicData }));
  }, [dispatch]);

  const removeTopic = useCallback((id) => {
    return dispatch(deleteTopic(id));
  }, [dispatch]);

  const loadTopicById = useCallback((id) => {
    return dispatch(fetchTopicById(id));
  }, [dispatch]);

  const clearTopicError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCurrentTopicData = useCallback(() => {
    dispatch(clearCurrentTopic());
  }, [dispatch]);

  // 초기 데이터 로드
  useEffect(() => {
    if (topics.length === 0 && !loading) {
      loadTopics();
    }
  }, [topics.length, loading, loadTopics]);

  return {
    // Data
    topics,
    currentTopic,
    recentTopics,
    statistics,
    
    // Status
    loading,
    saving,
    error,
    
    // Actions
    loadTopics,
    addTopic,
    editTopic,
    removeTopic,
    loadTopicById,
    clearError: clearTopicError,
    clearCurrentTopic: clearCurrentTopicData
  };
};
