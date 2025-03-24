// Food item
export interface Food {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  unit: string;
  servingSize: number;
}

// Food entry in a daily log
export interface FoodEntry {
  id: string;
  foodId: string;
  quantity: number;
  date: string;
}

// Daily log
export interface DailyLog {
  id: string;
  date: string;
  entries: FoodEntry[];
}

// App settings
export interface Settings {
  dailyCalorieGoal: number;
  carbPercentage: number;
  fatPercentage: number;
  proteinPercentage: number;
}

// Calculated nutrition for a day
export interface DailyNutrition {
  totalCalories: number;
  totalCarbs: number;
  totalFat: number;
  totalProtein: number;
  remainingCalories: number;
  remainingCarbs: number;
  remainingFat: number;
  remainingProtein: number;
}

// Food with calculated nutrition based on quantity
export interface FoodWithNutrition extends Food {
  calculatedCalories: number;
  calculatedCarbs: number;
  calculatedFat: number;
  calculatedProtein: number;
  quantity: number;
}
