import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DailyLog, FoodEntry } from '../types';
import { getDailyLogs, saveDailyLogs } from '../utils/fileUtils';

// Get all daily logs
export const getAllDailyLogs = (req: Request, res: Response) => {
  try {
    const logs = getDailyLogs();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    res.status(500).json({ message: 'Error fetching daily logs' });
  }
};

// Get daily log by date
export const getDailyLogByDate = (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const logs = getDailyLogs();
    const log = logs.find(log => log.date === date);
    
    if (!log) {
      // If log doesn't exist for this date, create a new empty one
      const newLog: DailyLog = {
        id: uuidv4(),
        date,
        entries: []
      };
      
      return res.status(200).json(newLog);
    }
    
    res.status(200).json(log);
  } catch (error) {
    console.error('Error fetching daily log:', error);
    res.status(500).json({ message: 'Error fetching daily log' });
  }
};

// Add food entry to daily log
export const addFoodEntry = (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const { foodId, quantity } = req.body;
    
    // Validate required fields
    if (!foodId || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    let logs = getDailyLogs();
    let log = logs.find(log => log.date === date);
    
    // If log doesn't exist for this date, create a new one
    if (!log) {
      log = {
        id: uuidv4(),
        date,
        entries: []
      };
      logs.push(log);
    }
    
    // Add new food entry
    const newEntry: FoodEntry = {
      id: uuidv4(),
      foodId,
      quantity: Number(quantity),
      date
    };
    
    // Find the log in the array (it might be a new one)
    const logIndex = logs.findIndex(l => l.date === date);
    logs[logIndex].entries.push(newEntry);
    
    saveDailyLogs(logs);
    
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error adding food entry:', error);
    res.status(500).json({ message: 'Error adding food entry' });
  }
};

// Update food entry
export const updateFoodEntry = (req: Request, res: Response) => {
  try {
    const { date, entryId } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({ message: 'Missing quantity field' });
    }
    
    let logs = getDailyLogs();
    const logIndex = logs.findIndex(log => log.date === date);
    
    if (logIndex === -1) {
      return res.status(404).json({ message: 'Daily log not found' });
    }
    
    const entryIndex = logs[logIndex].entries.findIndex(entry => entry.id === entryId);
    
    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Food entry not found' });
    }
    
    // Update entry
    logs[logIndex].entries[entryIndex].quantity = Number(quantity);
    
    saveDailyLogs(logs);
    
    res.status(200).json(logs[logIndex].entries[entryIndex]);
  } catch (error) {
    console.error('Error updating food entry:', error);
    res.status(500).json({ message: 'Error updating food entry' });
  }
};

// Delete food entry
export const deleteFoodEntry = (req: Request, res: Response) => {
  try {
    const { date, entryId } = req.params;
    
    // Debug logs to help diagnose the issue
    console.log("Delete request received:");
    console.log("Date param:", date);
    console.log("Entry ID param:", entryId);
    
    let logs = getDailyLogs();
    console.log("Total logs loaded:", logs.length);
    
    const log = logs.find(log => log.date === date);
    console.log("Found log for date:", log ? "Yes" : "No");
    
    if (log) {
      console.log("Log entries before deletion:", log.entries.length);
      console.log("Entries:", log.entries.map(e => e.id));
    }
    
    const logIndex = logs.findIndex(log => log.date === date);
    
    if (logIndex === -1) {
      console.log("Log not found for date:", date);
      return res.status(404).json({ 
        message: 'Daily log not found',
        date: date,
        availableDates: logs.map(l => l.date)
      });
    }
    
    const initialLength = logs[logIndex].entries.length;
    const entryToDelete = logs[logIndex].entries.find(entry => entry.id === entryId);
    console.log("Entry to delete found:", entryToDelete ? "Yes" : "No");
    
    logs[logIndex].entries = logs[logIndex].entries.filter(entry => entry.id !== entryId);
    
    console.log("Entries after filter:", logs[logIndex].entries.length);
    
    if (logs[logIndex].entries.length === initialLength) {
      console.log("No entries were deleted. Entry ID not found:", entryId);
      return res.status(404).json({ 
        message: 'Food entry not found',
        entryId: entryId,
        availableEntryIds: logs[logIndex].entries.map(e => e.id)
      });
    }
    
    saveDailyLogs(logs);
    console.log("Logs saved successfully");
    
    res.status(200).json({ message: 'Food entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting food entry:', error);
    res.status(500).json({ message: 'Error deleting food entry' });
  }
};
