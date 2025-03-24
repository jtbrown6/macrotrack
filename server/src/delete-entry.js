#!/usr/bin/env node

// This is a simpler script specifically to delete an entry by ID
// Usage: node server/src/delete-entry.js <date> <entryId>

const fs = require('fs');
const path = require('path');

// Command line arguments
const date = process.argv[2];
const entryId = process.argv[3];

if (!date || !entryId) {
  console.error('Usage: node delete-entry.js <date> <entryId>');
  console.error('Example: node delete-entry.js 2025-03-24 2d48202b-da66-4de9-a3ab-10f316b9800b');
  process.exit(1);
}

// Define data directory path
const DATA_DIR = path.join(__dirname, '../../data');
const DAILY_LOGS_FILE = path.join(DATA_DIR, 'daily-logs.json');

// Backup original file
const backupPath = path.join(DATA_DIR, `daily-logs-backup-${Date.now()}.json`);
fs.copyFileSync(DAILY_LOGS_FILE, backupPath);
console.log(`Backed up original file to ${backupPath}`);

// Load logs
try {
  const logs = JSON.parse(fs.readFileSync(DAILY_LOGS_FILE, 'utf-8'));
  
  // Find the log for the specified date
  const logIndex = logs.findIndex(log => log.date === date);
  
  if (logIndex === -1) {
    console.error(`No log found for date: ${date}`);
    console.log('Available dates:', logs.map(log => log.date));
    process.exit(1);
  }
  
  // Find the entry to delete
  const log = logs[logIndex];
  console.log(`Found log for date ${date} with ${log.entries.length} entries`);
  
  const entryToDelete = log.entries.find(entry => entry.id === entryId);
  if (!entryToDelete) {
    console.error(`No entry found with ID: ${entryId}`);
    console.log('Available entry IDs:', log.entries.map(e => e.id));
    process.exit(1);
  }
  
  console.log('Entry to delete:', entryToDelete);
  
  // Remove the entry
  const initialLength = log.entries.length;
  log.entries = log.entries.filter(entry => entry.id !== entryId);
  
  if (log.entries.length === initialLength) {
    console.error('Failed to delete entry - no change in entries count');
    process.exit(1);
  }
  
  console.log(`Deleted entry. Entries count reduced from ${initialLength} to ${log.entries.length}`);
  
  // Save the updated logs
  fs.writeFileSync(DAILY_LOGS_FILE, JSON.stringify(logs, null, 2));
  console.log('Logs file updated successfully');
  
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
