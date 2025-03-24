import fs from 'fs';
import path from 'path';
import { Food, DailyLog, Settings } from '../types';

const DATA_DIR = path.join(__dirname, '../../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File paths
const FOODS_FILE = path.join(DATA_DIR, 'foods.json');
const DAILY_LOGS_FILE = path.join(DATA_DIR, 'daily-logs.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Initialize files if they don't exist
const initializeDataFiles = () => {
  if (!fs.existsSync(FOODS_FILE)) {
    fs.writeFileSync(FOODS_FILE, JSON.stringify([], null, 2));
  }
  
  if (!fs.existsSync(DAILY_LOGS_FILE)) {
    fs.writeFileSync(DAILY_LOGS_FILE, JSON.stringify([], null, 2));
  }
  
  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings: Settings = {
      dailyCalorieGoal: 2400,
      carbPercentage: 40,
      fatPercentage: 15,
      proteinPercentage: 45
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
  }
};

// Read functions
export const getFoods = (): Food[] => {
  initializeDataFiles();
  try {
    const data = fs.readFileSync(FOODS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading foods file:', error);
    return [];
  }
};

export const getDailyLogs = (): DailyLog[] => {
  initializeDataFiles();
  try {
    const data = fs.readFileSync(DAILY_LOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading daily logs file:', error);
    return [];
  }
};

export const getSettings = (): Settings => {
  initializeDataFiles();
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings file:', error);
    return {
      dailyCalorieGoal: 2400,
      carbPercentage: 40,
      fatPercentage: 15,
      proteinPercentage: 45
    };
  }
};

// Write functions
export const saveFoods = (foods: Food[]): void => {
  initializeDataFiles();
  try {
    fs.writeFileSync(FOODS_FILE, JSON.stringify(foods, null, 2));
  } catch (error) {
    console.error('Error writing to foods file:', error);
  }
};

export const saveDailyLogs = (logs: DailyLog[]): void => {
  initializeDataFiles();
  try {
    fs.writeFileSync(DAILY_LOGS_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Error writing to daily logs file:', error);
  }
};

export const saveSettings = (settings: Settings): void => {
  initializeDataFiles();
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error writing to settings file:', error);
  }
};
