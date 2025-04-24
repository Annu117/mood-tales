import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const startEmotionMonitoring = async () => {
  try {
    console.log('Starting emotion monitoring...');
    const response = await axios.post(`${API_URL}/start-monitoring`);
    return response.data;
  } catch (error) {
    console.error('Error starting emotion monitoring:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to start emotion monitoring');
  }
};

export const stopEmotionMonitoring = async () => {
  try {
    console.log('Stopping emotion monitoring...');
    const response = await axios.post(`${API_URL}/stop-monitoring`);
    return response.data;
  } catch (error) {
    console.error('Error stopping emotion monitoring:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to stop emotion monitoring');
  }
};

export const getLatestEmotion = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-latest-emotion`);
    return response.data;
  } catch (error) {
    console.error('Error getting latest emotion:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to get latest emotion');
  }
};

export const captureEmotion = async () => {
  try {
    console.log('Starting single emotion capture...');
    const response = await axios.post(`${API_URL}/capture-emotion`);
    console.log('Emotion capture response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error capturing emotion:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to capture emotion');
  }
};

export const testEmotionAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/test-emotion-api`);
    return response.data;
  } catch (error) {
    console.error('Error testing emotion API:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to test emotion API');
  }
}; 