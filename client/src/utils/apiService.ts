import axios from 'axios';
import { Food, DailyLog, Settings, FoodEntry } from '../types';

// Configure axios with base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Food API calls
export const getFoods = async (): Promise<Food[]> => {
  const response = await api.get('/foods');
  return response.data;
};

export const getFoodById = async (id: string): Promise<Food> => {
  const response = await api.get(`/foods/${id}`);
  return response.data;
};

export const createFood = async (food: Omit<Food, 'id'>): Promise<Food> => {
  const response = await api.post('/foods', food);
  return response.data;
};

export const updateFood = async (id: string, food: Partial<Food>): Promise<Food> => {
  const response = await api.put(`/foods/${id}`, food);
  return response.data;
};

export const deleteFood = async (id: string): Promise<void> => {
  await api.delete(`/foods/${id}`);
};

// Daily log API calls
export const getDailyLogs = async (): Promise<DailyLog[]> => {
  const response = await api.get('/logs');
  return response.data;
};

export const getDailyLogByDate = async (date: string): Promise<DailyLog> => {
  const response = await api.get(`/logs/${date}`);
  return response.data;
};

export const addFoodEntry = async (date: string, entry: { foodId: string; quantity: number }): Promise<FoodEntry> => {
  const response = await api.post(`/logs/${date}/entries`, entry);
  return response.data;
};

export const updateFoodEntry = async (date: string, entryId: string, quantity: number): Promise<FoodEntry> => {
  const response = await api.put(`/logs/${date}/entries/${entryId}`, { quantity });
  return response.data;
};

export const deleteFoodEntry = async (date: string, entryId: string): Promise<void> => {
  try {
    // Make sure date is properly formatted as YYYY-MM-DD
    const formattedDate = date.includes('T') ? date.split('T')[0] : date;
    console.log(`Sending delete request for entry ID: ${entryId}`);
    console.log(`Date: ${formattedDate}`);
    console.log(`Full URL: ${API_BASE_URL}/logs/${formattedDate}/entries/${entryId}`);
    
    // Use a more direct approach with fetch to diagnose the issue
    const response = await fetch(`${API_BASE_URL}/logs/${formattedDate}/entries/${entryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    // Log successful deletion
    console.log(`Successfully deleted entry ${entryId}`);
    return;
  } catch (error) {
    console.error('Error deleting food entry:', error);
    throw error;
  }
};

// Settings API calls
export const getSettings = async (): Promise<Settings> => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settings: Partial<Settings>): Promise<Settings> => {
  const response = await api.put('/settings', settings);
  return response.data;
};

export const resetSettings = async (): Promise<Settings> => {
  const response = await api.post('/settings/reset');
  return response.data;
};

export default api;
