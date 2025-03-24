#!/usr/bin/env node

// This script can be used to repair, reset, or check the daily-logs.json file
// Run it with node server/src/reset-logs.js

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Define data directory path
const DATA_DIR = path.join(__dirname, '../../data');
const DAILY_LOGS_FILE = path.join(DATA_DIR, 'daily-logs.json');
const FOODS_FILE = path.join(DATA_DIR, 'foods.json');

// Create backup of current logs
function backupLogs() {
  if (fs.existsSync(DAILY_LOGS_FILE)) {
    const backupPath = path.join(DATA_DIR, `daily-logs-backup-${Date.now()}.json`);
    fs.copyFileSync(DAILY_LOGS_FILE, backupPath);
    console.log(`Created backup at ${backupPath}`);
  }
}

// Load existing data
function loadData() {
  try {
    // Load foods
    const foodsData = fs.existsSync(FOODS_FILE) 
      ? JSON.parse(fs.readFileSync(FOODS_FILE, 'utf-8')) 
      : [];
    
    // Load logs
    const logsData = fs.existsSync(DAILY_LOGS_FILE)
      ? JSON.parse(fs.readFileSync(DAILY_LOGS_FILE, 'utf-8'))
      : [];
    
    return { foods: foodsData, logs: logsData };
  } catch (error) {
    console.error('Error loading data:', error);
    return { foods: [], logs: [] };
  }
}

// Validate log entries
function validateLogs(logs, foods) {
  let isValid = true;
  let problems = [];
  let fixedLogs = [];
  
  // Check each log
  logs.forEach(log => {
    // Validate log structure
    if (!log.id || !log.date || !Array.isArray(log.entries)) {
      problems.push(`Log with date ${log.date || 'UNKNOWN'} has invalid structure`);
      isValid = false;
      return;
    }
    
    // Ensure ID is a string
    const fixedLog = {
      ...log,
      id: String(log.id),
      entries: []
    };
    
    // Validate entries
    log.entries.forEach(entry => {
      // Check entry structure
      if (!entry.id || !entry.foodId || entry.quantity === undefined) {
        problems.push(`Entry ${entry.id || 'UNKNOWN'} in log ${log.date} has invalid structure`);
        isValid = false;
        return;
      }
      
      // Validate food reference
      const food = foods.find(f => f.id === entry.foodId);
      if (!food) {
        problems.push(`Entry ${entry.id} in log ${log.date} references non-existent food ${entry.foodId}`);
        // Skip this entry as it references an invalid food
        return;
      }
      
      // Add the fixed entry (ensuring proper types)
      fixedLog.entries.push({
        id: String(entry.id),
        foodId: String(entry.foodId),
        quantity: Number(entry.quantity),
        date: String(entry.date)
      });
    });
    
    fixedLogs.push(fixedLog);
  });
  
  return { isValid, problems, fixedLogs };
}

// Save logs
function saveLogs(logs) {
  try {
    fs.writeFileSync(DAILY_LOGS_FILE, JSON.stringify(logs, null, 2));
    console.log('Logs saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving logs:', error);
    return false;
  }
}

// Main function
function main() {
  console.log('Log Repair Utility');
  console.log('==================');
  
  // Create backup
  backupLogs();
  
  // Load data
  const { foods, logs } = loadData();
  console.log(`Loaded ${foods.length} foods and ${logs.length} daily logs`);
  
  // Validate logs
  const { isValid, problems, fixedLogs } = validateLogs(logs, foods);
  
  if (isValid) {
    console.log('All logs are valid!');
  } else {
    console.log('Found problems in logs:');
    problems.forEach(problem => console.log(`- ${problem}`));
    
    console.log(`\nSaving fixed logs (${fixedLogs.length} logs)`);
    if (saveLogs(fixedLogs)) {
      console.log('Logs have been fixed and saved!');
    }
  }
  
  // Display current logs for verification
  console.log('\nCurrent logs after validation:');
  const currentLogs = JSON.parse(fs.readFileSync(DAILY_LOGS_FILE, 'utf-8'));
  
  currentLogs.forEach(log => {
    console.log(`Log Date: ${log.date} (ID: ${log.id})`);
    console.log(`Entries: ${log.entries.length}`);
    log.entries.forEach(entry => {
      console.log(`  - Entry ID: ${entry.id}, Food ID: ${entry.foodId}, Quantity: ${entry.quantity}`);
    });
    console.log('');
  });
}

// Execute the main function
main();
