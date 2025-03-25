import fs from 'fs';
import path from 'path';
import { Food, DailyLog, Settings } from '../types';

// Use absolute path in production, relative path in development
const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? path.join('/app/data') 
  : path.join(__dirname, '../../../data');

console.log(`[DEBUG] Using data directory: ${DATA_DIR}`);
console.log(`[DEBUG] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[DEBUG] Current directory: ${__dirname}`);

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  console.log(`[DEBUG] Data directory does not exist, creating it: ${DATA_DIR}`);
  fs.mkdirSync(DATA_DIR, { recursive: true });
} else {
  console.log(`[DEBUG] Data directory exists: ${DATA_DIR}`);
  // List files in the data directory
  try {
    const files = fs.readdirSync(DATA_DIR);
    console.log(`[DEBUG] Files in data directory: ${JSON.stringify(files)}`);
  } catch (error: any) {
    console.error(`[DEBUG] Error reading data directory: ${error}`);
    console.error(`[DEBUG] Error stack: ${error.stack}`);
  }
}

// File paths
const FOODS_FILE = path.join(DATA_DIR, 'foods.json');
const DAILY_LOGS_FILE = path.join(DATA_DIR, 'daily-logs.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Initialize files if they don't exist
const initializeDataFiles = () => {
  console.log(`[DEBUG] Initializing data files if they don't exist`);
  
  if (!fs.existsSync(FOODS_FILE)) {
    console.log(`[DEBUG] Foods file does not exist, creating it: ${FOODS_FILE}`);
    try {
      fs.writeFileSync(FOODS_FILE, JSON.stringify([], null, 2));
      console.log(`[DEBUG] Successfully created foods file`);
    } catch (error: any) {
      console.error(`[DEBUG] Error creating foods file: ${error}`);
      console.error(`[DEBUG] Error stack: ${error.stack}`);
    }
  }
  
  if (!fs.existsSync(DAILY_LOGS_FILE)) {
    console.log(`[DEBUG] Daily logs file does not exist, creating it: ${DAILY_LOGS_FILE}`);
    try {
      fs.writeFileSync(DAILY_LOGS_FILE, JSON.stringify([], null, 2));
      console.log(`[DEBUG] Successfully created daily logs file`);
    } catch (error: any) {
      console.error(`[DEBUG] Error creating daily logs file: ${error}`);
      console.error(`[DEBUG] Error stack: ${error.stack}`);
    }
  }
  
  if (!fs.existsSync(SETTINGS_FILE)) {
    console.log(`[DEBUG] Settings file does not exist, creating it: ${SETTINGS_FILE}`);
    const defaultSettings: Settings = {
      dailyCalorieGoal: 2400,
      carbPercentage: 40,
      fatPercentage: 15,
      proteinPercentage: 45
    };
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
      console.log(`[DEBUG] Successfully created settings file`);
    } catch (error: any) {
      console.error(`[DEBUG] Error creating settings file: ${error}`);
      console.error(`[DEBUG] Error stack: ${error.stack}`);
    }
  }
};

// Read functions
export const getFoods = (): Food[] => {
  initializeDataFiles();
  try {
    console.log(`[DEBUG] Reading foods file: ${FOODS_FILE}`);
    console.log(`[DEBUG] File exists: ${fs.existsSync(FOODS_FILE)}`);
    
    const data = fs.readFileSync(FOODS_FILE, 'utf-8');
    console.log(`[DEBUG] Foods data length: ${data.length}`);
    
    const parsed = JSON.parse(data);
    console.log(`[DEBUG] Parsed foods count: ${parsed.length}`);
    
    return parsed;
  } catch (error: any) {
    console.error(`[DEBUG] Error reading foods file: ${error}`);
    console.error(`[DEBUG] Error stack: ${error.stack}`);
    return [];
  }
};

export const getDailyLogs = (): DailyLog[] => {
  initializeDataFiles();
  try {
    console.log(`[DEBUG] Reading daily logs file: ${DAILY_LOGS_FILE}`);
    console.log(`[DEBUG] File exists: ${fs.existsSync(DAILY_LOGS_FILE)}`);
    
    const data = fs.readFileSync(DAILY_LOGS_FILE, 'utf-8');
    console.log(`[DEBUG] Daily logs data length: ${data.length}`);
    
    const parsed = JSON.parse(data);
    console.log(`[DEBUG] Parsed daily logs count: ${parsed.length}`);
    
    return parsed;
  } catch (error: any) {
    console.error(`[DEBUG] Error reading daily logs file: ${error}`);
    console.error(`[DEBUG] Error stack: ${error.stack}`);
    return [];
  }
};

export const getSettings = (): Settings => {
  initializeDataFiles();
  try {
    console.log(`[DEBUG] Reading settings file: ${SETTINGS_FILE}`);
    console.log(`[DEBUG] File exists: ${fs.existsSync(SETTINGS_FILE)}`);
    
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    console.log(`[DEBUG] Settings data length: ${data.length}`);
    
    const parsed = JSON.parse(data);
    console.log(`[DEBUG] Parsed settings: ${JSON.stringify(parsed)}`);
    
    return parsed;
  } catch (error: any) {
    console.error(`[DEBUG] Error reading settings file: ${error}`);
    console.error(`[DEBUG] Error stack: ${error.stack}`);
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
    console.log(`[DEBUG] Writing to foods file: ${FOODS_FILE}`);
    console.log(`[DEBUG] Foods data to write: ${JSON.stringify(foods).substring(0, 100)}...`);
    
    fs.writeFileSync(FOODS_FILE, JSON.stringify(foods, null, 2));
    console.log(`[DEBUG] Successfully wrote to foods file`);
  } catch (error: any) {
    console.error(`[DEBUG] Error writing to foods file: ${error}`);
    console.error(`[DEBUG] Error stack: ${error.stack}`);
  }
};

export const saveDailyLogs = (logs: DailyLog[]): void => {
  initializeDataFiles();
  try {
    console.log(`[DEBUG] Writing to daily logs file: ${DAILY_LOGS_FILE}`);
    console.log(`[DEBUG] Daily logs data to write: ${JSON.stringify(logs).substring(0, 100)}...`);
    
    fs.writeFileSync(DAILY_LOGS_FILE, JSON.stringify(logs, null, 2));
    console.log(`[DEBUG] Successfully wrote to daily logs file`);
  } catch (error: any) {
    console.error(`[DEBUG] Error writing to daily logs file: ${error}`);
    console.error(`[DEBUG] Error stack: ${error.stack}`);
  }
};

export const saveSettings = (settings: Settings): void => {
  initializeDataFiles();
  try {
    console.log(`[DEBUG] Writing to settings file: ${SETTINGS_FILE}`);
    console.log(`[DEBUG] Settings data to write: ${JSON.stringify(settings)}`);
    
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    console.log(`[DEBUG] Successfully wrote to settings file`);
  } catch (error: any) {
    console.error(`[DEBUG] Error writing to settings file: ${error}`);
    console.error(`[DEBUG] Error stack: ${error.stack}`);
  }
};
