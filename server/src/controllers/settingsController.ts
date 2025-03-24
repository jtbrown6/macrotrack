import { Request, Response } from 'express';
import { Settings } from '../types';
import { getSettings, saveSettings } from '../utils/fileUtils';

// Get settings
export const getAppSettings = (req: Request, res: Response) => {
  try {
    const settings = getSettings();
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

// Update settings
export const updateSettings = (req: Request, res: Response) => {
  try {
    const { dailyCalorieGoal, carbPercentage, fatPercentage, proteinPercentage } = req.body;
    
    // Get current settings
    const currentSettings = getSettings();
    
    // Validate macro percentages add up to 100%
    const totalPercentage = 
      (carbPercentage !== undefined ? Number(carbPercentage) : currentSettings.carbPercentage) +
      (fatPercentage !== undefined ? Number(fatPercentage) : currentSettings.fatPercentage) +
      (proteinPercentage !== undefined ? Number(proteinPercentage) : currentSettings.proteinPercentage);
    
    if (totalPercentage !== 100) {
      return res.status(400).json({ 
        message: 'Macro percentages must add up to 100%',
        currentTotal: totalPercentage
      });
    }
    
    // Update settings
    const updatedSettings: Settings = {
      dailyCalorieGoal: dailyCalorieGoal !== undefined ? Number(dailyCalorieGoal) : currentSettings.dailyCalorieGoal,
      carbPercentage: carbPercentage !== undefined ? Number(carbPercentage) : currentSettings.carbPercentage,
      fatPercentage: fatPercentage !== undefined ? Number(fatPercentage) : currentSettings.fatPercentage,
      proteinPercentage: proteinPercentage !== undefined ? Number(proteinPercentage) : currentSettings.proteinPercentage
    };
    
    saveSettings(updatedSettings);
    
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
};

// Reset settings to defaults
export const resetSettings = (req: Request, res: Response) => {
  try {
    const defaultSettings: Settings = {
      dailyCalorieGoal: 2400,
      carbPercentage: 40,
      fatPercentage: 15,
      proteinPercentage: 45
    };
    
    saveSettings(defaultSettings);
    
    res.status(200).json(defaultSettings);
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Error resetting settings' });
  }
};
