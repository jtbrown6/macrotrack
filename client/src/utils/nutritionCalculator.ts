import { Food, FoodEntry, Settings, DailyNutrition, FoodWithNutrition } from '../types';

/**
 * Calculate nutrition data for a food entry
 */
export const calculateFoodNutrition = (food: Food, quantity: number, entryId?: string): FoodWithNutrition => {
  const multiplier = quantity / food.servingSize;
  
  return {
    ...food,
    // Use the provided entryId if available, otherwise use the food id
    id: entryId || food.id,
    quantity,
    calculatedCalories: food.calories * multiplier,
    calculatedCarbs: food.carbs * multiplier,
    calculatedFat: food.fat * multiplier,
    calculatedProtein: food.protein * multiplier
  };
};

/**
 * Calculate daily nutrition totals and remaining values
 */
export const calculateDailyNutrition = (
  foodEntries: FoodWithNutrition[],
  settings: Settings
): DailyNutrition => {
  // Calculate totals
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calculatedCalories, 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + entry.calculatedCarbs, 0);
  const totalFat = foodEntries.reduce((sum, entry) => sum + entry.calculatedFat, 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + entry.calculatedProtein, 0);
  
  // Calculate target values based on settings
  const targetCalories = settings.dailyCalorieGoal;
  const targetCarbs = (settings.carbPercentage / 100) * settings.dailyCalorieGoal / 4; // 4 calories per gram of carbs
  const targetFat = (settings.fatPercentage / 100) * settings.dailyCalorieGoal / 9; // 9 calories per gram of fat
  const targetProtein = (settings.proteinPercentage / 100) * settings.dailyCalorieGoal / 4; // 4 calories per gram of protein
  
  // Calculate remaining values
  const remainingCalories = Math.max(0, targetCalories - totalCalories);
  const remainingCarbs = Math.max(0, targetCarbs - totalCarbs);
  const remainingFat = Math.max(0, targetFat - totalFat);
  const remainingProtein = Math.max(0, targetProtein - totalProtein);
  
  return {
    totalCalories,
    totalCarbs,
    totalFat,
    totalProtein,
    remainingCalories,
    remainingCarbs,
    remainingFat,
    remainingProtein
  };
};

/**
 * Calculate percentage of total for each macro
 */
export const calculateMacroPercentages = (carbs: number, fat: number, protein: number) => {
  const total = carbs + fat + protein;
  
  if (total === 0) {
    return { carbsPercentage: 0, fatPercentage: 0, proteinPercentage: 0 };
  }
  
  return {
    carbsPercentage: Math.round((carbs / total) * 100),
    fatPercentage: Math.round((fat / total) * 100),
    proteinPercentage: Math.round((protein / total) * 100)
  };
};

/**
 * Format number to 1 decimal place
 */
export const formatNumber = (value: number): string => {
  return value.toFixed(1);
};
