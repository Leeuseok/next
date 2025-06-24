import { useState, useEffect } from 'react';
import { topicsApi } from '../lib/api';

// Topics 데이터를 관리하는 커스텀 훅
export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await topicsApi.getAll();
      setTopics(response.data);
    } catch (err) {
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addTopic = async (topicData) => {
    try {
      const response = await topicsApi.create(topicData);
      setTopics(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || '주제 추가에 실패했습니다.');
      throw err;
    }
  };

  const updateTopic = async (id, topicData) => {
    try {
      const response = await topicsApi.update(id, topicData);
      setTopics(prev => prev.map(topic => 
        topic.id === id ? response.data : topic
      ));
      return response.data;
    } catch (err) {
      setError(err.message || '주제 수정에 실패했습니다.');
      throw err;
    }
  };

  const deleteTopic = async (id) => {
    try {
      await topicsApi.delete(id);
      setTopics(prev => prev.filter(topic => topic.id !== id));
    } catch (err) {
      setError(err.message || '주제 삭제에 실패했습니다.');
      throw err;
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics,
    loading,
    error,
    fetchTopics,
    addTopic,
    updateTopic,
    deleteTopic,
  };
}

// 단일 Topic을 관리하는 커스텀 훅
export function useTopic(id) {
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopic = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await topicsApi.getById(id);
      setTopic(response.data);
    } catch (err) {
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, [id]);

  return {
    topic,
    loading,
    error,
    refetch: fetchTopic,
  };
}
